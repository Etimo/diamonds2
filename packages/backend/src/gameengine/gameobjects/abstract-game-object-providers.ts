import {
  BotProviderConfig,
  DiamondProviderConfig,
  TeleportProviderConfig,
  TeleportRelocationProviderConfig,
} from "@etimo/diamonds2-types";
import { IBot } from "../../types";
import { Board } from "../board";
import { AbstractGameObject } from "./abstract-game-object";

export abstract class AbstractGameObjectProvider<
  T =
    | DiamondProviderConfig
    | BotProviderConfig
    | TeleportProviderConfig
    | TeleportRelocationProviderConfig
    | null,
> {
  public config: Readonly<T | null>;

  constructor(config?: T) {
    this.config = Object.freeze(config || null);
  }

  onBoardInitialized(board: Board) {}
  onBotJoined(bot: IBot, board: Board) {}
  onBotFinished(bot: IBot, board: Board) {}

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {}
  onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {}
}
