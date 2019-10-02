import { Injectable, Scope, NotFoundException } from "@nestjs/common";
import { Board } from "src/gameengine/board";
import { CustomLogger } from "src/logger";
import { DiamondButtonProvider } from "src/gameengine/gameobjects/diamond-button/diamond-button-provider";
import { BaseProvider } from "src/gameengine/gameobjects/base/base-provider";
import { DiamondProvider } from "src/gameengine/gameobjects/diamond/diamond-provider";
import { BotProvider } from "src/gameengine/gameobjects/bot/bot-provider";
import { BoardConfig } from "src/gameengine/board-config";
import { BoardDto } from "src/models/board.dto";
import { GameObjectDto } from "src/models/game-object.dto";
import NotFoundError from "src/errors/not-found.error";
import { BotsService } from "./bots.service";
import UnauthorizedError from "src/errors/unauthorized.error";
import { MoveDirection } from "src/enums/move-direction.enum";
import { IPosition } from "src/common/interfaces/position.interface";
import * as async from "async";
import { IBot } from "src/interfaces/bot.interface";
import { OperationQueueMoveEvent, OperationQueueEvent, OperationQueueJoinEvent } from 'src/models/operation-queue.event';

@Injectable({ scope: Scope.DEFAULT })
export class BoardsService {
  private boards: Board[] = [];
  private opQueue;

  constructor(private botsService: BotsService, private logger: CustomLogger) {
    this.createInMemoryBoard();
    this.setupOperationQueue();
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

    // Queue join
    const event = new OperationQueueJoinEvent(
      bot,
      board
    );
    return new Promise((resolve, reject) => {
      this.opQueue.push(
        event,
        (res, err) => {
          console.log(res, err);
          if (err) {
            reject(err);
          } else {
            console.log(bot.name, "join done", res);
            resolve(this.getAsDto(board));
          }
        },
      );
    });
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

    // Queue move
    const event = new OperationQueueMoveEvent(
      bot,
      board,
      this.directionToDelta(direction),
    );
    return new Promise((resolve, reject) => {
      this.opQueue.push(
        event,
        (res, err) => {
          console.log(res, err);
          if (err) {
            reject(err);
          } else {
            console.log(bot.name, "move done", res);
            resolve(this.getAsDto(board));
          }
        },
      );
    });
  }

  private getBoardById(id: string): Board {
    return this.boards.find(b => b.getId() === id);
  }

  /**
   * The board uses an operation queue to handle multiple requests to operate on the board.
   * All operations on the board are queued and handled one after another.
   * Currently all move commands are handled using this queue.
   */
  private setupOperationQueue() {
    // Move queue
    const sleep = m => new Promise(r => setTimeout(r, m));
    this.opQueue = async.queue(async (t: OperationQueueEvent, cb) => {
      // console.log("Operation queue task received", t);
      const board: Board = t["board2"];
      const bot: IBot = t["bot"];
      const direction: IPosition = t["direction"];
      const queuedAt: Date = t["queuedAt"];

      // Simulate slow operations
      console.log(bot.name, "before sleep");
      await sleep(3000);
      console.log(bot.name, "after sleep");
      console.log(
        "Current queue time:",
        new Date().getTime() - queuedAt.getTime(),
        "ms",
      );
      try {
        const res = t.run();
        cb(res);
      } catch (e) {
        cb(null, e);
      }
    });
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
        return <GameObjectDto>{
          id: g.id,
          position: g.position,
          type: g.constructor.name,
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
    const board = new Board(config, providers, this.logger);
    this.boards.push(board);
  }
}
