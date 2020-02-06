import { Injectable, Scope, NotFoundException } from "@nestjs/common";

import { HighScoresService } from "./high-scores.service";
import { OperationQueueBoard } from "../gameengine/operation-queue-board";
import { BotsService } from "./bots.service";
import { CustomLogger } from "../logger";
import NotFoundError from "../errors/not-found.error";
import { IPosition } from "../common/interfaces/position.interface";
import { Board } from "../gameengine/board";
import { GameObjectDto } from "../models/game-object.dto";
import { DiamondButtonProvider } from "../gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BoardConfig } from "../gameengine/board-config";
import { BotProvider} from "../gameengine/gameobjects/bot/bot-provider";
import { DummyBotProvider} from "../gameengine/gameobjects/dummy-bot/dummy-bot-provider";
import { DiamondProvider} from "../gameengine/gameobjects/diamond/diamond-provider";
import { BaseProvider} from "../gameengine/gameobjects/base/base-provider";
import { BoardDto} from "../models/board.dto";
import { MoveDirection} from "../enums/move-direction.enum";
import UnauthorizedError from "../errors/unauthorized.error";
@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: OperationQueueBoard[] = [];

  constructor(
    private botsService: BotsService,
    private highscoresService: HighScoresService,
    private logger: CustomLogger,
  ) {
    this.createInMemoryBoard();

    this.boards.forEach(board => {
      board.registerSessionFinishedCallback((botName, score) => {
        console.log("HIGHSCORE", botName, score);
        this.highscoresService.addOrUpdate({
          botName,
          score,
        });
      });
    });
  }

  /**
   * Return all boards.
   */
  public getAll(): BoardDto[] {
    return this.boards.map(b => this.getAsDto(b));
  }

  /**
   * Return a specific board.
   * @param id The id of the board to return.
   */
  public getById(id: string): BoardDto {
    const board = this.getBoardById(id);
    if (board) {
      return this.getAsDto(board);
    }
    throw new NotFoundError("Board not found");
  }

  /**
   *
   * @param boardId
   * @param bot
   */
  public async join(boardId: string, botToken: string) {
    const bot = await this.botsService.get(botToken);
    if (!bot) {
      throw new UnauthorizedError("Invalid botToken");
    }
    const board = this.getBoardById(boardId);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    return board.enqueueJoin(bot);
  }

  public async move(
    boardId: string,
    botToken: string,
    direction: MoveDirection,
  ) {
    // Get board to move on
    const board = this.getBoardById(boardId);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    // Get bot to move from board
    const bot = board.getBot(botToken);
    if (!bot) {
      throw new UnauthorizedError("Invalid botToken");
    }

    return board.enqueueMove(bot, this.directionToDelta(direction));
  }

  private getBoardById(id: string): OperationQueueBoard {
    return this.boards.find(b => b.getId() === id);
  }

  /**
   * Convert a MoveDirection enum to a delta IPosition.
   * @param direction
   */
  private directionToDelta(direction: MoveDirection): IPosition {
    switch (direction) {
      case MoveDirection.NORTH:
        return { x: 0, y: -1 };
      case MoveDirection.SOUTH:
        return { x: 0, y: 1 };
      case MoveDirection.WEST:
        return { x: -1, y: 0 };
      case MoveDirection.EAST:
        return { x: 1, y: 0 };
      default:
        throw Error();
    }
  }

  /**
   * Convert a board to a dto.
   * @param board
   */
  private getAsDto(board: Board): BoardDto {
    return {
      id: `${board.getId()}`,
      width: board.width,
      height: board.height,
      minimumDelayBetweenMoves: board.getConfig().minimumDelayBetweenMoves,
      gameObjects: board.getAllGameObjects().map(g => {
        return  {
          id: g.id,
          position: g.position,
          type: g.constructor.name,
          properties: g.properties,
        } as GameObjectDto;
      }),
    };
  }

  /**
   * Create an example board for debugging purpose.
   */
  private createInMemoryBoard(): void {
    const providers = [
      new DiamondButtonProvider(),
      new BaseProvider(),
      new DiamondProvider({
        generationRatio: 0.1,
        minRatioForGeneration: 0.01,
      }),
      new DummyBotProvider({
        inventorySize: 5,
      }),
      new BotProvider({
        inventorySize: 5,
      }),
    ];
    const config: BoardConfig = {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
      sessionLength: 60,
    };
    const board = new OperationQueueBoard(config, providers, this.logger);
    this.boards.push(board);
  }
}
