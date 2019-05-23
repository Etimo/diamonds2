import { AbstractGameObject } from "../game-object";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "../bot/bot";

export class BaseGameObject extends AbstractGameObject {
    protected type: string = "base";

    toChar() {
        return "B";
    }

    onGameObjectEntered(gameObject: AbstractGameObject, board: Board) {
        if (gameObject instanceof BotGameObject) {
            const bot = gameObject as BotGameObject;
            bot.score += bot.diamonds;
            bot.diamonds = 0;
        }
    }
}