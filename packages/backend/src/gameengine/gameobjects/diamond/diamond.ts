import { DiamondGameObjectProperties } from "@etimo/diamonds2-types";
import { IPosition } from "../../../types/position";
import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject } from "../bot/bot";

export class DiamondGameObject extends AbstractGameObject {
  constructor(position: IPosition, public points: number) {
    super(position);
  }

  public get properties(): DiamondGameObjectProperties {
    return {
      points: this.points,
    };
  }
  /**
   * Remove the diamond when a bot enters and put it in the bot's inventory.
   */
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    /* istanbul ignore else */
    if (gameObject instanceof BotGameObject) {
      const bot = gameObject as BotGameObject;
      if (bot.diamonds + this.points <= bot.inventorySize) {
        bot.diamonds += this.points;
        board.removeGameObject(this);
      }
    }
  }
}
