import { Board } from "../board";
import { AbstractGameObject } from "./abstract-game-object";
import { IBot } from "src/interfaces/bot.interface";
export declare abstract class AbstractGameObjectProvider {
    onBoardInitialized(board: Board): void;
    onBotJoined(bot: IBot, board: Board): void;
    onBotFinished(bot: IBot, board: Board): void;
    onGameObjectsRemoved(board: Board, gameObjects: AbstractGameObject[]): void;
    onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]): void;
}
