import { Board } from "../board";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { DiamondGameObject } from "../gameobjects/diamond";

export abstract class DiamondGeneratorHandler {
    onBoardInitialized(board: Board) {
        this.generate(board);
    }
    onBoardNotified(board: Board) {
        this.generate(board);
    }

    private generate(board: Board) {
        const numberOfDiamonds = board.width * board.height * 0.2;
        const diamonds = new Array(numberOfDiamonds);
        board.addGameObject(new DiamondGameObject({x: 0, y: 0}, Math.random() < 0.5 ? 1 : 2));
    }
}