import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { AbstractGameObject } from "../abstract-game-object";
import { DiamondButtonGameObject } from "./diamond-button";
import { DiamondGameObject } from "../diamond/diamond";
import { Board } from "../../board";

export class DiamondButtonProvider extends AbstractGameObjectProvider {
  /**
   * Listen for when game objects are removed and generate new button when needed.
   */
  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {
    // Check number of diamonds on the board
    const existingButtons = board.getGameObjectsByType(DiamondButtonGameObject);
    /* istanbul ignore else */
    if (existingButtons.length == 0) {
      this.generateNewButton(board);
    }
  }

  onBoardInitialized(board: Board) {
    this.generateNewButton(board);
  }

  private generateNewButton(board: Board) {
    const position = board.getEmptyPosition();
    const button = new DiamondButtonGameObject(position);
    board.addGameObjects([button]);
  }
}
