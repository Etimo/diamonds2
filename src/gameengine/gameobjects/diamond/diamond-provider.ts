import { AbstractGameObjectProvider } from "../game-object-providers";
import { Board } from "src/gameengine/board";
import { DiamondGameObject } from "./diamond";

export class DiamondProvider extends AbstractGameObjectProvider {
    onBoardInitialized(board: Board) {
        this.generateDiamonds(board);
    }

    onGameObjectsRemoved(board: Board, gameObjects: any) {
        const diamonds = board.getGameObjectsByType(DiamondGameObject);
        const minLimit = board.width * board.height * 0.01;
        if (diamonds.length == 0) {
            this.generateDiamonds(board);
        }
    }

    private generateDiamonds(board: Board) {
        const count = board.width * board.height * 0.1;
        const diamonds = new Array(count).fill(null).map(_ => new DiamondGameObject(board.getEmptyPosition(), 1));
        board.addGameObjects(diamonds);
    }
}