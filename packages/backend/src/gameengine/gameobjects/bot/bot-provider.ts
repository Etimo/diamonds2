import { BotProviderConfig, Position } from "@etimo/diamonds2-types";
import { IBot } from "../../../types";
import { Board } from "../../board";
import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { BotGameObject } from "./bot";
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

  protected getInitializedBot(
    data: Partial<IBot>,
    base: Position,
    board: Board,
  ) {
    const timeJoined = new Date();
    const defaultConfig = {
      inventorySize: 0,
      canTackle: false,
    };
    const config = this.config || defaultConfig;
    const botGameObject = new BotGameObject({
      base: { x: base.x, y: base.y },
      botId: data.id ?? "",
      expiresAt: new Date(
        timeJoined.getTime() + board.getConfig().sessionLength * 1000,
      ),
      nextMoveAvailableAt: new Date(),
      inventorySize: config.inventorySize || 0,
      canTackle: config.canTackle || false,
      diamonds: 0,
      score: 0,
      name: data.name ?? "",
      timeJoined,
    });
    return botGameObject;
  }
}
