import { Board } from "../board";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { DiamondGameObject } from "../gameobjects/diamond";

export abstract class BaseProviderHandler {
    onBotJoined(bot: IBot, board: Board) {
    }
}