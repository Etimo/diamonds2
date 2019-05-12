import { AbstractGameObjectProvider } from "../game-object-providers";
import { IPosition } from "src/interfaces/position.interface";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "src/gameengine/board";

export class BaseProvider extends AbstractGameObjectProvider {
    onBotJoined(bot: IBoardBot, board: Board) {
        const position = board.getEmptyPosition();
        bot.base = position;
    }
}