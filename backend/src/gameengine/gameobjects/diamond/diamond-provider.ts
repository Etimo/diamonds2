import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { DiamondGameObject } from "./diamond";

export interface Config {
  /**
   * The minimum ratio (percent of board size) of diamonds before new ones should be generated.
   */
  minRatioForGeneration: number;
  /**
   * The ratio (percent of board size) of diamonds to generate
   */
  generationRatio: number;
}

export class DiamondProvider extends AbstractGameObjectProvider {
  constructor(private config: Config) {
    super();
  }

  onBoardInitialized(board: Board) {
    this.generateDiamonds(board);
  }

  onGameObjectsRemoved(board: Board, other) {
    const diamonds = board.getGameObjectsByType(DiamondGameObject);
    const minLimit =
      board.width * board.height * this.config.minRatioForGeneration;
    if (diamonds.length == 0) {
      this.generateDiamonds(board);
    }
  }

  private generateDiamonds(board: Board) {
    const count = board.width * board.height * this.config.generationRatio;
    const diamonds = new Array(count)
      .fill(null)
      .map(_ => new DiamondGameObject(board.getEmptyPosition(), 1));
    board.addGameObjects(diamonds);
  }
}
