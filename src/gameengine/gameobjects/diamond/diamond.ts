import { AbstractGameObject } from "../abstract-game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/common/interfaces/position.interface";
import { BotGameObject } from "../bot/bot";
import { DummyBotGameObject } from "../dummy-bot/dummy-bot";

export class DiamondGameObject extends AbstractGameObject {
  public readonly type: string = "diamond";

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
      const bot = gameObject as BotGameObject;
      console.log("Diamond collision", bot.diamonds);
      if (bot.diamonds + this.points <= board.getConfig().maxCarryingDiamonds) {
        bot.diamonds += this.points;
        board.removeGameObject(this);
      }
      console.log("Diamond collision after", bot.diamonds);
    }
  }
}
