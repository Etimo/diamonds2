import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { DiamondGameObject } from "./diamond";

export interface DiamondProviderConfig {
  /**
   * The minimum ratio (percent of board size) of diamonds before new ones should be generated.
   */
  minRatioForGeneration: number;
  /**
   * The ratio (percent of board size) of diamonds to generate
   */
  generationRatio: number;
  /**
   * The ratio (percent of total diamonds generated) of diamonds that should be red
   */
  redRatio: number;
}

export class DiamondProvider extends AbstractGameObjectProvider<
  DiamondProviderConfig
> {
  constructor(config: DiamondProviderConfig) {
    super(config);
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
    const count = Math.floor(
      board.width * board.height * this.config.generationRatio,
    );
    const diamonds = new Array(count)
      .fill(null)
      .map(_ => new DiamondGameObject(board.getEmptyPosition(), 1));
    const redDiamonds = Math.floor(diamonds.length * this.config.redRatio);
    for (let i = 0; i < redDiamonds; i++) {
      diamonds[i].points = 2;
    }
    board.addGameObjects(diamonds);
  }
}
