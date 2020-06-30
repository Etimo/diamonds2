import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { IBot } from "src/interfaces/bot.interface";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "./bot";
import { IPosition } from "src/common/interfaces/position.interface";

export interface BotProviderConfig {
  /**
   * The maximum number of diamonds a bot can carry at the same time.
   */
  inventorySize: number;
  /**
   * The bot can tackle other bots.
   */
  canTackle: boolean;
}

export class BotProvider extends AbstractGameObjectProvider<BotProviderConfig> {
  constructor(config: BotProviderConfig) {
    super(config);
  }

  onBotJoined(bot: IBot, board: Board) {
    // Add game object to board
    const base = board.getEmptyPosition();
    const botGameObject = this.getInitializedBot(bot, base, board);
    board.addGameObjects([botGameObject]);
  }

  protected getInitializedBot(data: IBot, base: IPosition, board: Board) {
    const botGameObject = new BotGameObject(base);
    botGameObject.base = { x: base.x, y: base.y };
    botGameObject.timeJoined = new Date();
    botGameObject.expiresAt = new Date(
      botGameObject.timeJoined.getTime() +
        board.getConfig().sessionLength * 1000,
    );
    botGameObject.diamonds = 0;
    botGameObject.score = 0;
    botGameObject.inventorySize = this.config.inventorySize;
    botGameObject.canTackle = this.config.canTackle;
    botGameObject.name = data.botName;
    return botGameObject;
  }
}
