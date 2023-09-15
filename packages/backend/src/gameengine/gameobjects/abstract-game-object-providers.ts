import { IBot } from "../../types";
import { Board } from "../board";
import { AbstractGameObject } from "./abstract-game-object";

export abstract class AbstractGameObjectProvider<T = {}> {
  public config: Readonly<T>;

  constructor(config?: T) {
    this.config = Object.freeze(config ?? ({} as T));
  }

  onBoardInitialized(board: Board) {}
  onBotJoined(bot: IBot, board: Board) {}
  onBotFinished(bot: IBot, board: Board) {}

  onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {}
  onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {}
}
