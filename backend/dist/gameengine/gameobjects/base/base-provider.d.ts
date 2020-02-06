import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { AbstractGameObject } from "../abstract-game-object";
export declare class BaseProvider extends AbstractGameObjectProvider {
    onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]): void;
    onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]): void;
}
