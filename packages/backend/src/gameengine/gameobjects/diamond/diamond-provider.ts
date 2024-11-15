import { DiamondProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board.ts";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers.ts";
import { DiamondGameObject } from "./diamond.ts";

export class DiamondProvider
  extends AbstractGameObjectProvider<DiamondProviderConfig> {
  constructor(config: DiamondProviderConfig) {
    super(config);
  }

  override onBoardInitialized(board: Board) {
    this.generateDiamonds(board);
  }

  override onGameObjectsRemoved(board: Board, other: any) {
    const diamonds = board.getGameObjectsByType(DiamondGameObject);
    const minLimit = board.width * board.height *
      this.config.minRatioForGeneration;
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
      .map((_) => new DiamondGameObject(board.getEmptyPosition(), 1));
    const redDiamonds = Math.floor(diamonds.length * this.config.redRatio);
    for (let i = 0; i < redDiamonds; i++) {
      diamonds[i].points = 2;
    }
    board.addGameObjects(diamonds);
  }
}
