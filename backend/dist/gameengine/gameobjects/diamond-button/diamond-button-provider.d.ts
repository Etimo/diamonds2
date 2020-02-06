import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { AbstractGameObject } from "../abstract-game-object";
export declare class DiamondButtonProvider extends AbstractGameObjectProvider {
    onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]): void;
    onBoardInitialized(board: Board): void;
    private generateNewButton;
}
