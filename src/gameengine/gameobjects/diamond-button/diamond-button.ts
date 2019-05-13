import { AbstractGameObject } from "../game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/interfaces/position.interface";
import { DiamondGameObject } from "../diamond/diamond";
import { BotGameObject } from "../bot/bot";

export class DiamondButtonGameObject extends AbstractGameObject {
  protected type: string = "diamondButton";

  toChar() {
    return "☐";
  }

  /**
   * Clear all diamonds when a bot enters the cell of this button.
   */
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      board.removeGameObjectsByType(DiamondGameObject);
    }
  }
}
