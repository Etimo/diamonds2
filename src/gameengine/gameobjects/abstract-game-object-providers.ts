import { Board } from "../board";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { AbstractGameObject } from "./abstract-game-object";

export abstract class AbstractGameObjectProvider {
    onBoardInitialized(board: Board) {}
    onBotJoined(bot: IBoardBot, board: Board) {}
    onBotFinished(bot: IBoardBot, board: Board) {}

    onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]) {}
    onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {}
  }
  