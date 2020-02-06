import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { IPosition } from "src/common/interfaces/position.interface";
export declare class DiamondGameObject extends AbstractGameObject {
    private readonly points;
    constructor(position: IPosition, points: any);
    onGameObjectEntered(gameObject: AbstractGameObject, board: Board): void;
}
