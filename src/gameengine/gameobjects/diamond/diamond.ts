import { AbstractGameObject } from "../abstract-game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../../board";
import { IPosition } from "src/common/interfaces/position.interface";
import { BotGameObject } from "../bot/bot";
import { DummyBotGameObject } from "../dummy-bot/dummy-bot";

export class DiamondGameObject extends AbstractGameObject {
  constructor(position: IPosition, private readonly points) {
    super(position);
  }

  /**
   * Remove the diamond when a bot enters and put it in the bot's inventory.
   */
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      const bot = gameObject as BotGameObject;
      if (bot.diamonds + this.points <= bot.inventorySize) {
        bot.diamonds += this.points;
        board.removeGameObject(this);
      }
    }
  }
}
