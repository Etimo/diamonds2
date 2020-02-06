import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { IPosition } from "../../../common/interfaces/position.interface";
export declare class TeleportGameObject extends AbstractGameObject {
    private readonly pairId;
    constructor(position: IPosition, pairId: string);
    onGameObjectEntered(gameObject: AbstractGameObject, board: Board): void;
}
