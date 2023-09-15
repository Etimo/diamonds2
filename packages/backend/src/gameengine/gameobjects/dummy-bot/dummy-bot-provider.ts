import { Board } from "../../board";
import { AbstractGameObject } from "../abstract-game-object";
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

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]): void {
    const dummyBots = board.getGameObjectsByType(DummyBotGameObject);
    if (dummyBots.length == 0) {
      // Recreate the bots
      this.onBoardInitialized(board);
    }
  }
}
