import { FireGameObjectProperties, Position } from "@etimo/diamonds2-types";
import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject } from "../bot/bot";
export class FireGameObject extends AbstractGameObject {
  constructor(
    position: Position,
    private readonly _properties: FireGameObjectProperties,
  ) {
    super(position);
  }

  get properties(): FireGameObjectProperties {
    return this._properties;
  }

  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    const bot = gameObject as BotGameObject;

    bot.diamonds = 0;

    // Try to set new position until true
    while (!board.trySetGameObjectPosition(this, board.getEmptyPosition())) {
      continue;
    }
  }
}
