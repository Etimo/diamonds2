import { Position } from "@etimo/diamonds2-types";
import * as async from "async";
import { IBoardConfig, IBot } from "../types/index.ts";
import { Board } from "./board.ts";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers.ts";
/**
 * A class that wraps a board with an operation queue. This class will abstract the handling of operations
 * on the board to prevent multiple simultaneous operations at the same time.
 *
 * At the moment the following operations are handled in a queue:
 * * move
 * * join
 */
export class OperationQueueBoard extends Board {
  private opQueue!: ReturnType<typeof async.queue<OperationQueueEvent>>;

  constructor(
    id: number,
    config: IBoardConfig,
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
    const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
    this.opQueue = async.queue(async (t: OperationQueueEvent) => {
      return await t.run();
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
      this.opQueue.push<boolean>(event, (err, result) => {
        if (result !== undefined) return resolve(result);
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  /**
   * Queue a move on a board. Will prevent multiple simultaneous calls to collide.
   * @param bot
   */
  public async enqueueMove(bot: IBot, delta: Position): Promise<boolean> {
    const event = new OperationQueueMoveEvent(bot, this, delta);
    return new Promise((resolve, reject) => {
      this.opQueue.push<boolean>(event, (err, result) => {
        if (result !== undefined) return resolve(result);
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }
}

export class OperationQueueEvent {
  queuedAt = new Date();

  constructor(
    protected bot: IBot,
    protected board: Board,
  ) {}

  run(): Promise<boolean> {
    throw Error("Not implemented");
  }
}

export class OperationQueueMoveEvent extends OperationQueueEvent {
  constructor(
    protected bot: IBot,
    protected board: Board,
    protected delta: Position,
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
