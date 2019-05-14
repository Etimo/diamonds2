import { BotGameObject } from "../bot/bot";
import { AbstractGameObject } from "../game-object";
import { Board } from "src/gameengine/board";
import { DiamondGameObject } from "../diamond/diamond";

export class DummyBotGameObject extends BotGameObject {
    onGameObjectCallbackNotified(board: Board) {
        const diamonds = board.getGameObjectsByType(DiamondGameObject);
        if (diamonds.length > 0) {
            const goal = diamonds[0];
            const dx = goal.x - this.position.x;
            const dy = goal.y - this.position.y;
            const dest = {
                x: this.position.x,
                y: this.position.y
            };
            if (dx < 0) {
                board.moveGameObjectX(this, -1);
            } else if (dx > 0) {
                board.moveGameObjectX(this, 1);
            } else if (dy < 0) {
                board.moveGameObjectY(this, -1);
            } else if (dy > 0) {
                board.moveGameObjectY(this, 1);
            }
        }
    }
}