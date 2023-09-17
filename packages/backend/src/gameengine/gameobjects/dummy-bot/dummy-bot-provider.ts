import { DummyBotProviderConfig } from "@etimo/diamonds2-types";
import { IBot } from "../../../types";
import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
import { BotProvider } from "../bot/bot-provider";
import { DummyBotGameObject } from "./dummy-bot";

export class DummyBotProvider extends BotProvider {
  constructor(config: DummyBotProviderConfig) {
    // @ts-ignore
    super(config);
  }

  onBoardInitialized(board: Board) {
    const config = this.config as unknown as DummyBotProviderConfig;
    for (let i = 1; i < config.count + 1; i++) {
      const bot = this.getInitializedBot(
        {
          name: config.prefix + " " + i,
        },
        board.getEmptyPosition(),
        board,
      );
      const dummyBot = new DummyBotGameObject({ ...bot });

      // Register move timer
      board.registerGameObjectForCallbackLoop(dummyBot, 1000);

      // Register session finished timer
      const boardConfig = board.getConfig();
      board.registerGameObjectForCallbackLoop(
        dummyBot,
        boardConfig.sessionLength * 1000,
      );
      board.addGameObjects([dummyBot]);
    }
  }

  onBotJoined(bot: IBot, board: Board) {
    // DO NOTHING.
    // Override this function so we don't trigger BotProvider onBotJoined twice.
  }

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]): void {
    const dummyBots = board.getGameObjectsByType(DummyBotGameObject);
    if (dummyBots.length == 0) {
      // Recreate the bots
      this.onBoardInitialized(board);
    }
  }
}
