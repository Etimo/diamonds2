import { AbstractGameObjectProvider } from "../game-object-providers";
import { IPosition } from "src/interfaces/position.interface";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "../bot/bot";
import { AbstractGameObject } from "../game-object";
import { BaseGameObject } from "./base";

export class BaseProvider extends AbstractGameObjectProvider {
    onGameObjectsAdded(board: Board, gameObjects: AbstractGameObject[]) {
        gameObjects.filter(g => g instanceof BotGameObject).forEach((bot: BotGameObject) => {
            // Whenever a bot game object is added to the board, add a base for it
            board.addGameObjects([new BaseGameObject(bot.base)]);
        });
    }
}