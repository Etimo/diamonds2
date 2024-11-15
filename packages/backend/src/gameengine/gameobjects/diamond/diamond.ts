import { DiamondGameObjectProperties, Position } from "@etimo/diamonds2-types";
import { Board } from "../../board.ts";
import { AbstractGameObject } from "../abstract-game-object.ts";
import { BotGameObject } from "../bot/bot.ts";
export class DiamondGameObject extends AbstractGameObject {
  constructor(
    position: Position,
    public points: number,
  ) {
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
      if (gameObject.diamonds + this.points <= gameObject.inventorySize) {
        gameObject.diamonds += this.points;
        board.removeGameObject(this);
      }
    }
  }
}
