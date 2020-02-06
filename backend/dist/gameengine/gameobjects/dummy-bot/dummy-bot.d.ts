import { BotGameObject } from "../bot/bot";
import { Board } from "src/gameengine/board";
export declare class DummyBotGameObject extends BotGameObject {
    onGameObjectCallbackNotified(board: Board, intervalMs: number): void;
}
