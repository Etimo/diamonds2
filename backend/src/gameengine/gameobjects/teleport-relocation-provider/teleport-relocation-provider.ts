import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { AbstractGameObject } from "../abstract-game-object";
import { DiamondGameObject } from "../diamond/diamond";
import { TeleportGameObject } from "../teleport/teleport";

export interface TeleportRelocationProviderConfig {
  /**
   * The number of seconds to wait before relocating teleporters.
   */
  seconds: number;
}

/**
 * This provider listens for when diamonds are removed and moves the any teleporters whenever diamonds are regenerated.
 */
export class TeleportRelocationProvider extends AbstractGameObjectProvider<
  TeleportRelocationProviderConfig
> {
  onBoardInitialized(board: Board) {
    setInterval(_ => {
      const teleporters = board.getGameObjectsByType(TeleportGameObject);
      teleporters.forEach(t => {
        const inititalPosition = t.position;
        // Continue generating new position until it's not the same as initial
        while ((t.position = board.getEmptyPosition()) == inititalPosition) {}
      });
    }, this.config.seconds * 1000);
  }
}
