import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { TeleportGameObject } from "./teleport";

export interface TeleportProviderConfig {
  /**
   * The number of pairs of teleporters that will be generated.
   */
  pairs: number;
}

export class TeleportProvider extends AbstractGameObjectProvider<
  TeleportProviderConfig
> {
  constructor(config: TeleportProviderConfig) {
    super(config);
  }

  onBoardInitialized(board: Board) {
    this.generateTeleports(board);
  }

  private generateTeleports(board: Board) {
    for (let i = 0; i < this.config.pairs; i++) {
      const pairId = `${i + 1}`;
      board.addGameObjects([
        new TeleportGameObject(board.getEmptyPosition(), pairId),
        new TeleportGameObject(board.getEmptyPosition(), pairId),
      ]);
    }
  }
}
