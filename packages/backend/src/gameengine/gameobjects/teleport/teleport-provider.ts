import { TeleportProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board.ts";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers.ts";
import { TeleportGameObject } from "./teleport.ts";

export class TeleportProvider
  extends AbstractGameObjectProvider<TeleportProviderConfig> {
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
