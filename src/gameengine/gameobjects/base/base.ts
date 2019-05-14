import { AbstractGameObject } from "../game-object";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "../bot/bot";

export class BaseGameObject extends AbstractGameObject {
    protected type: string = "base";

    toChar() {
        return "B";
    }

    onGameObjectEntered(bot: BotGameObject, board: Board) {
        bot.score += bot.diamonds;
        bot.diamonds = 0;
    }
}