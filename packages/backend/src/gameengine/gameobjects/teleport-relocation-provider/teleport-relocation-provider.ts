import { TeleportRelocationProviderConfig } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { TeleportGameObject } from "../teleport/teleport";

/**
 * This provider moves all teleporters on the board when a certain time has passed.
 */
export class TeleportRelocationProvider extends AbstractGameObjectProvider<TeleportRelocationProviderConfig> {
  onBoardInitialized(board: Board) {
    setInterval((_) => {
      const teleporters = board.getGameObjectsByType(TeleportGameObject);
      teleporters.forEach((t) => {
        const inititalPosition = t.position;
        // Continue generating new position until it's not the same as initial
        while ((t.position = board.getEmptyPosition()) == inititalPosition) {}
      });
    }, this.config.seconds * 1000);
  }
}
