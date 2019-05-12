import { AbstractGameObjectProvider } from "../game-object-providers";
import { Board } from "src/gameengine/board";
import { AbstractGameObject } from "../game-object";
import { DiamondButtonGameObject } from "./diamond-button";

export class DiamondButtonProvider extends AbstractGameObjectProvider {
    onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {
        const existingButtons = board.getGameObjectsByType(DiamondButtonGameObject);
        if (existingButtons.length == 0) {
            this.generateNewButton(board);
        }
    }

    private generateNewButton(board: Board) {
        const position = board.getEmptyPosition();
        const button = new DiamondButtonGameObject(position);
        board.addGameObjects([button]);
    }
}