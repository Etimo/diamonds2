import { Board } from "./board";
import { IBot } from "src/interfaces/bot.interface";
import { IPosition } from "src/common/interfaces/position.interface";
import * as async from "async";
import { BoardConfig } from "./board-config";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";

/**
 * A class that wraps a board with an operation queue. This class will abstract the handling of operations
 * on the board to prevent multiple simultaneous operations at the same time.
 *
 * At the moment the following operations are handled in a queue:
 * * move
 * * join
 */
export class OperationQueueBoard extends Board {
  private opQueue;

  constructor(
    id: number,
    config: BoardConfig,
    gameObjectProviders: AbstractGameObjectProvider[],
    protected logger: any,
  ) {
    super(id, config, gameObjectProviders, logger);
    this.setupOperationQueue();
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
      const board: Board = t["board"];
      const bot: IBot = t["bot"];
      const direction: IPosition = t["direction"];
      const queuedAt: Date = t["queuedAt"];

      // Simulate slow operations
      // console.log(bot.name, "before sleep");
      // await sleep(3000);
      // console.log(bot.name, "after sleep");
      // console.log(
      //   "Current queue time:",
      //   new Date().getTime() - queuedAt.getTime(),
      //   "ms",
      // );
      try {
        const res = t.run();
        cb(res);
      } catch (e) {
        cb(null, e);
      }
    });
  }

  /**
   * Queue a join to a board. Will prevent multiple simultaneous calls to collide.
   * @param bot
   */
  public async enqueueJoin(bot: IBot): Promise<boolean> {
    // Queue join
    const event = new OperationQueueJoinEvent(bot, this);
    return new Promise((resolve, reject) => {
      this.opQueue.push(event, (res, err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(res);
        }
      });
    });
  }

  /**
   * Queue a move on a board. Will prevent multiple simultaneous calls to collide.
   * @param bot
   */
  public async enqueueMove(bot: IBot, delta: IPosition): Promise<boolean> {
    const event = new OperationQueueMoveEvent(bot, this, delta);
    return new Promise((resolve, reject) => {
      this.opQueue.push(event, (res, err) => {
        if (err) {
          resolve(false);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export class OperationQueueEvent {
  queuedAt = new Date();

  constructor(protected bot: IBot, protected board: Board) {}

  run() {
    throw Error("Not implemented");
  }
}

export class OperationQueueMoveEvent extends OperationQueueEvent {
  constructor(
    protected bot: IBot,
    protected board: Board,
    protected delta: IPosition,
  ) {
    super(bot, board);
  }

  run() {
    return this.board.move(this.bot, this.delta);
  }
}

export class OperationQueueJoinEvent extends OperationQueueEvent {
  run() {
    return this.board.join(this.bot);
  }
}
