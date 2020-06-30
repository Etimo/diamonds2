/* istanbul ignore file */
import { Board } from "../board";
import { AbstractGameObject } from "./abstract-game-object";
import { IBot } from "src/interfaces/bot.interface";

export abstract class AbstractGameObjectProvider<T = {}> {
  public config: T;

  constructor(config?: T) {
    this.config = Object.freeze(config);
  }

  onBoardInitialized(board: Board) {}
  onBotJoined(bot: IBot, board: Board) {}
  onBotFinished(bot: IBot, board: Board) {}

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {}
  onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {}
}
