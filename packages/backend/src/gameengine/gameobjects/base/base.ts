import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject, IBotGameObject } from "../bot/bot";

export class BaseGameObject extends AbstractGameObject {
  constructor(private bot: IBotGameObject) {
    super(bot.base);
  }
  public get properties() {
    return {
      name: this.bot.name,
    };
  }
  onGameObjectEntered(gameObject: AbstractGameObject) {
    if (gameObject instanceof BotGameObject) {
      const bot = gameObject as BotGameObject;
      if (bot.base === this.bot.base) {
        bot.score += bot.diamonds;
        bot.diamonds = 0;
      }
    }
  }
}
