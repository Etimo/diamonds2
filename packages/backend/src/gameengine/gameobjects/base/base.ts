import { AbstractGameObject } from "../abstract-game-object";
import { BotGameObject } from "../bot/bot";

export class BaseGameObject extends AbstractGameObject {
  constructor(private bot: BotGameObject) {
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
