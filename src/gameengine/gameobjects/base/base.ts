import { AbstractGameObject } from "../abstract-game-object";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "../bot/bot";

export class BaseGameObject extends AbstractGameObject {
  onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
    if (gameObject instanceof BotGameObject) {
      const bot = gameObject as BotGameObject;
      bot.score += bot.diamonds;
      bot.diamonds = 0;
    }
  }
}
