import { AbstractGameObject } from "./game-object";
import { IBoardBot } from "src/interfaces/board-bot.interface";
import { Board } from "../board";
import { IPosition } from "src/interfaces/position.interface";

export class TeleportGameObject extends AbstractGameObject {
    constructor(position: IPosition, private readonly pairId: string) {
        super(position);
    }

    onBotEntered(bot: IBoardBot, board: Board) {
        const teleports = board.getGameObjectsByType<TeleportGameObject>();
        const otherTeleport = teleports.find(t => t.pairId == this.pairId && t != this);
        bot.position.x = otherTeleport.position.x;
        bot.position.y = otherTeleport.position.y;
    }
}