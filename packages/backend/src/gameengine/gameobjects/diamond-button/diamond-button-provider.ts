import { AbstractGameObjectProvider } from "../abstract-game-object-providers.ts";
import { AbstractGameObject } from "../abstract-game-object.ts";
import { DiamondButtonGameObject } from "./diamond-button.ts";
import { DiamondGameObject } from "../diamond/diamond.ts";
import { Board } from "../../board.ts";

export class DiamondButtonProvider extends AbstractGameObjectProvider {
  /**
   * Listen for when game objects are removed and generate new button when needed.
   */
  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {
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
