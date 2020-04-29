import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { DiamondGameObject } from "../diamond/diamond";
import { BotGameObject } from "../bot/bot";

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
