import { AbstractGameObjectProvider } from "../game-object-providers";
import { IBot } from "src/interfaces/bot.interface";
import { Board } from "src/gameengine/board";
import { IBoardBot } from "src/interfaces/board-bot.interface";

export class BotProvider extends AbstractGameObjectProvider {
    onBotJoined(bot: IBoardBot, board: Board) {
        
    }
}