import { AbstractGameObject } from "../abstract-game-object.ts";
import { Board } from "../../board.ts";
import { DiamondGameObject } from "../diamond/diamond.ts";
import { BotGameObject } from "../bot/bot.ts";

export class DiamondButtonGameObject extends AbstractGameObject {
  /**
   * Clear all diamonds when a bot enters the cell of this button.
   */
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    /* istanbul ignore else */
    if (gameObject instanceof BotGameObject) {
      board.removeGameObjectsByType(DiamondButtonGameObject);
      board.removeGameObjectsByType(DiamondGameObject);
    }
  }
}
