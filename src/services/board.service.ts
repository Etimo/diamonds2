import { Injectable, Scope, NotFoundException } from "@nestjs/common";
import { Board } from "src/gameengine/board";
import { CustomLogger } from "src/logger";
import { DiamondButtonProvider } from "src/gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "src/gameengine/gameobjects/base/base-provider";
import { DiamondProvider } from "src/gameengine/gameobjects/diamond/diamond-provider";
import { BotProvider } from "src/gameengine/gameobjects/bot/bot-provider";
import { DummyBotProvider } from "src/gameengine/gameobjects/dummy-bot/dummy-bot-provider";
import { BoardConfig } from "src/gameengine/board-config";
import { IBot } from "src/interfaces/bot.interface";
import { AbstractGameObject } from "src/gameengine/gameobjects/abstract-game-object";
import { BoardDto } from "src/models/board.dto";
import { GameObjectDto } from "src/models/game-object.dto";

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: Board[] = [];

  constructor(private logger: CustomLogger) {
    this.createInMemoryBoard();
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
    throw new NotFoundException("Board not found");
  }

  /**
   *
   * @param boardId
   * @param bot
   */
  public join(boardId: string, bot: IBot): boolean {
    // const botExists = this.botRepository.botExists(bot);
    // if (!botExists) return error
    const board = this.getBoardById(boardId);
    if (board) {
      board.join(bot);
      return true;
    }
    throw new NotFoundException("Board not found");
  }

  public move(
    boardId: string,
    bot: IBot,
    position: Position,
  ): AbstractGameObject[] {
    // const botExists = this.botRepository.botExists(bot);
    // if (!botExists) return error
    const board = this.getBoardById(boardId);
    if (board) {
      board.move(bot, position);
      return board.getAllGameObjects();
    }
    throw new NotFoundException("Board not found");
  }

  private getBoardById(id: string): Board {
    return this.boards.find(b => b.getId() === id);
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
        return <GameObjectDto>{
          position: g.position,
          type: g.constructor.name,
          id: g.id,
          properties: g.properties,
        };
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
      new BotProvider({
        inventorySize: 5,
      }),
      new DummyBotProvider(),
    ];
    const config: BoardConfig = {
      height: 10,
      width: 10,
      minimumDelayBetweenMoves: 100,
    };
    const board = new Board(config, providers, this.logger);
    this.boards.push(board);
  }
}
