import { AbstractGameObject } from "./game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../board";
import { IPosition } from "src/interfaces/position.interface";

export class DiamondGameObject extends AbstractGameObject {
    constructor(position: IPosition, private readonly points) {
        super(position);
    }

    onBotEntered(bot: IBoardBot, board: Board) {
        if (bot.diamonds + this.points <= board.getMaxNumberOfCarryingDiamonds()) {
            bot.diamonds += this.points;
            board.removeGameObject(this);
        }
    }
}