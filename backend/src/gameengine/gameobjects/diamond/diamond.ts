import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";

import { BotGameObject } from "../bot/bot";
import { IPosition } from "../../../common/interfaces/position.interface";

export class DiamondGameObject extends AbstractGameObject {
  constructor(position: IPosition, readonly points) {
    super(position);
  }

  public get properties() {
    return {
      points: this.points,
    };
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
