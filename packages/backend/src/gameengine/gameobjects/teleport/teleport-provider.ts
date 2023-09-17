import { TeleportProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { TeleportGameObject } from "./teleport";

export class TeleportProvider extends AbstractGameObjectProvider<TeleportProviderConfig> {
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
        new TeleportGameObject(board.getEmptyPosition(), { pairId }),
        new TeleportGameObject(board.getEmptyPosition(), { pairId }),
      ]);
    }
  }
}
