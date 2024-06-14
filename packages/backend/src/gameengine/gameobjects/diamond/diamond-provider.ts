import { DiamondProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { DiamondGameObject } from "./diamond";

export class DiamondProvider extends AbstractGameObjectProvider<DiamondProviderConfig> {
  constructor(config: DiamondProviderConfig) {
    super(config);
  }

  onBoardInitialized(board: Board) {
    this.generateDiamonds(board);
  }

  onGameObjectsRemoved(board: Board, other: any) {
    const diamonds = board.getGameObjectsByType(DiamondGameObject);
    const defaultConfig = {
      minRatioForGeneration: 0,
    };
    const config = this.config || defaultConfig;
    const minLimit = board.width * board.height * config.minRatioForGeneration;
    if (diamonds.length == 0) {
      this.generateDiamonds(board);
    }
  }

  private generateDiamonds(board: Board) {
    const defaultConfig = {
      generationRatio: 0,
      redRatio: 0,
    };
    const config = this.config || defaultConfig;
    const count = Math.floor(
      board.width * board.height * config.generationRatio,
    );
    const diamonds = new Array(count)
      .fill(null)
      .map((_) => new DiamondGameObject(board.getEmptyPosition(), 1));
    const redDiamonds = Math.floor(diamonds.length * config.redRatio);
    for (let i = 0; i < redDiamonds; i++) {
      diamonds[i].points = 2;
    }
    board.addGameObjects(diamonds);
  }
}
