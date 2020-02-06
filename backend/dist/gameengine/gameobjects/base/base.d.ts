import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "src/gameengine/board";
export declare class BaseGameObject extends AbstractGameObject {
    onGameObjectEntered(gameObject: AbstractGameObject, board: Board): void;
}
