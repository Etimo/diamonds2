import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { Board } from "src/gameengine/board";
import { DummyBotGameObject } from "./dummy-bot";
import { BotProvider, BotProviderConfig } from "../bot/bot-provider";

export class DummyBotProvider extends BotProvider {
  constructor(config: BotProviderConfig) {
    super(config);
  }

  onBoardInitialized(board: Board) {
    const bot = this.getInitializedBot(
      {
        name: "Etimo1",
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
    dummyBot.name = bot.name;

    board.registerGameObjectForCallbackLoop(dummyBot, 1000);
    board.addGameObjects([dummyBot]);
  }
}
