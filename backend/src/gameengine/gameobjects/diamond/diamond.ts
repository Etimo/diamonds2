import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "../../board";
import { IPosition } from "src/common/interfaces/position.interface";
import { BotGameObject } from "../bot/bot";

export interface DiamondGameObjectProperties {
  points: number;
}

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
