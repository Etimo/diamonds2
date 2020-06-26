import { Board } from "src/gameengine/board";
import { BotProvider, BotProviderConfig } from "../bot/bot-provider";
import { DummyBotGameObject } from "./dummy-bot";

export interface DummyBotProviderConfig extends BotProviderConfig {
  /**
   * Number of dummy bots to spawn.
   */
  count: number;
  /**
   * Name prefix
   */
  prefix: string;
}

export class DummyBotProvider extends BotProvider {
  constructor(config: DummyBotProviderConfig) {
    super(config);
  }

  onBoardInitialized(board: Board) {
    const config = this.config as DummyBotProviderConfig;
    for (let i = 1; i < config.count + 1; i++) {
      const bot = this.getInitializedBot(
        {
          botName: config.prefix + " " + i,
        },
        board.getEmptyPosition(),
        board,
      );
      const dummyBot = new DummyBotGameObject(board.getEmptyPosition());
      dummyBot.base = bot.base;
      dummyBot.timeJoined = bot.timeJoined;
      dummyBot.expiresAt = bot.expiresAt;
      dummyBot.diamonds = bot.diamonds;
      dummyBot.score = bot.score;
      dummyBot.inventorySize = bot.inventorySize;
      dummyBot.canTackle = bot.canTackle;
      dummyBot.name = bot.name;

      board.registerGameObjectForCallbackLoop(dummyBot, 1000);
      board.addGameObjects([dummyBot]);
    }
  }
}
