import { Board } from "./board";
import { IBot } from "src/interfaces/bot.interface";
import { IPosition } from "src/common/interfaces/position.interface";
import { BoardConfig } from "./board-config";
import { AbstractGameObjectProvider } from "./gameobjects/abstract-game-object-providers";
export declare class OperationQueueBoard extends Board {
    protected config: BoardConfig;
    protected gameObjectProviders: AbstractGameObjectProvider[];
    protected logger: any;
    private opQueue;
    constructor(config: BoardConfig, gameObjectProviders: AbstractGameObjectProvider[], logger: any);
    private setupOperationQueue;
    enqueueJoin(bot: IBot): Promise<boolean>;
    enqueueMove(bot: IBot, delta: IPosition): Promise<boolean>;
}
export declare class OperationQueueEvent {
    protected bot: IBot;
    protected board: Board;
    queuedAt: Date;
    constructor(bot: IBot, board: Board);
    run(): void;
}
export declare class OperationQueueMoveEvent extends OperationQueueEvent {
    protected bot: IBot;
    protected board: Board;
    protected delta: IPosition;
    constructor(bot: IBot, board: Board, delta: IPosition);
    run(): Promise<boolean>;
}
export declare class OperationQueueJoinEvent extends OperationQueueEvent {
    run(): Promise<boolean>;
}
