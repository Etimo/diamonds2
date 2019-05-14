import { AbstractGameObjectProvider } from "../game-object-providers";
import { IBot } from "src/interfaces/bot.interface";
import { Board } from "src/gameengine/board";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { BotGameObject } from "./bot";
import { IPosition } from "src/common/interfaces/position.interface";

export class BotProvider extends AbstractGameObjectProvider {
    onBotJoined(bot: IBoardBot, board: Board) {
        // Add game object to board
        const base = board.getEmptyPosition();
        const botGameObject = this.getInitializedBot(bot, base);
        board.addGameObjects([botGameObject]);
    }

    private getInitializedBot(data: IBoardBot, base: IPosition) {
        const botGameObject = new BotGameObject(base);
        botGameObject.base = base;
        botGameObject.timeJoined = new Date();
        botGameObject.diamonds = 0;
        botGameObject.score = 0;
        return botGameObject;
    }
}