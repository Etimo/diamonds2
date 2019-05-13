import { AbstractGameObject } from "../game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/interfaces/position.interface";
import { BotGameObject } from "../bot/bot";

export class DiamondGameObject extends AbstractGameObject {
  protected type: string = "diamond";

  toChar() {
    return this.points === 1 ? "🔹" : "🔶";
  }
  constructor(position: IPosition, private readonly points) {
    super(position);
  }

  /**
   * Remove the diamond when a bot enters and put it in the bot's inventory.
   */
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      if (gameObject.diamonds + this.points <= board.getConfig().maxCarryingDiamonds) {
        gameObject.diamonds += this.points;
        board.removeGameObject(this);
      }
    }
  }
}
