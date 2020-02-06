import { Board } from "../board";
import { IPosition } from "src/common/interfaces/position.interface";
export declare abstract class AbstractGameObject {
    private positions;
    private static nextId;
    private readonly _id;
    constructor(startPosition: IPosition);
    get x(): number;
    get y(): number;
    get id(): number;
    get position(): IPosition;
    set position(newPosition: IPosition);
    get previousPosition(): {
        x: number;
        y: number;
    };
    get properties(): object;
    hasAlreadyBeenHere(position: IPosition): boolean;
    clearPositions(): void;
    canGameObjectEnter(gameObject: AbstractGameObject, board: Board): boolean;
    onGameObjectEntered(gameObject: AbstractGameObject, board: Board): void;
    canGameObjectLeave(gameObject: AbstractGameObject, board: Board): boolean;
    onGameObjectLeft(gameObject: AbstractGameObject, board: Board): void;
    onGameObjectCallbackNotified(board: Board, intervalMs: number): void;
    onGameObjectRemoved(board: Board): void;
    onEvent(board: Board, sender: AbstractGameObject, message: string, payload?: Object): void;
    toLogString(): string;
}
