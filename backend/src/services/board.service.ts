import { Injectable, Scope } from "@nestjs/common";
import { OperationQueueBoard } from "../gameengine/operation-queue-board";
import { BotsService } from "./bots.service";
import { HighScoresService } from "./high-scores.service";
import { CustomLogger } from "../logger";
import { BoardDto } from "../models/board.dto";
import NotFoundError from "../errors/not-found.error";
import UnauthorizedError from "../errors/unauthorized.error";
import ConflictError from "../errors/conflict.error";
import { MoveDirection } from "../enums/move-direction.enum";
import ForbiddenError from "../errors/forbidden.error";
import { IBot } from "../interfaces/bot.interface";
import { IPosition } from "../common/interfaces/position.interface";
import { Board } from "../gameengine/board";
import { GameObjectDto } from "../models/game-object.dto";
import { DiamondButtonProvider } from "../gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "../gameengine/gameobjects/base/base-provider";
import { DiamondProvider } from "../gameengine/gameobjects/diamond/diamond-provider";
import { BotProvider } from "../gameengine/gameobjects/bot/bot-provider";
import { BoardConfig } from "../gameengine/board-config";

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: OperationQueueBoard[] = [];
  private lastMoveTimes: {};

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
  public getById(id: number): BoardDto {
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
  public async join(boardId: number, botToken: string) {
    const bot = await this.botsService.get(botToken);
    if (!bot) {
      throw new UnauthorizedError("Invalid botToken");
    }
    const board = this.getBoardById(boardId);
    if (!board) {
      throw new NotFoundError("Board not found");
    }

    const boardBot = board.getBot(botToken);

    if (boardBot) {
      throw new ConflictError("Already on board");
    }

    const result = await board.enqueueJoin(bot);
    if (!result) {
      throw new ConflictError("Board full");
    }
    return this.getAsDto(board);
  }

  public async move(
    boardId: number,
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

    // Rate limit moves
    if (this.moveIsRateLimited(board, bot)) {
      const delay = board.getConfig().minimumDelayBetweenMoves;
      throw new ConflictError(`Minimum delay between moves: (${delay} ms`);
    }
    board.updateLastMove(bot);

    const result = await board.enqueueMove(
      bot,
      this.directionToDelta(direction),
    );

    if (!result) {
      throw new ForbiddenError("Move not legal");
    }

    return this.getAsDto(board);
  }

  private moveIsRateLimited(board: OperationQueueBoard, bot: IBot) {
    const lastMove = board.getLastMove(bot);
    const timeBetweenMoves = board.getConfig().minimumDelayBetweenMoves;
    const now = Date.now();
    return lastMove > now - timeBetweenMoves;
  }

  private getBoardById(id: number): OperationQueueBoard {
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
      id: board.getId(),
      width: board.width,
      height: board.height,
      minimumDelayBetweenMoves: board.getConfig().minimumDelayBetweenMoves,
      features: board.gameObjectProviders.map(gop => {
        return {
          name: gop.constructor.name,
          config: gop.config,
        };
      }),
      gameObjects: board.getAllGameObjects().map(g => {
        return {
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
      // new DummyBotProvider({
      //   inventorySize: 5,
      // }),
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
