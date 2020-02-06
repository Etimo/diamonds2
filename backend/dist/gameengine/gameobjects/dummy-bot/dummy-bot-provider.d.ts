import { Board } from "src/gameengine/board";
import { BotProvider, Config } from "../bot/bot-provider";
export declare class DummyBotProvider extends BotProvider {
    protected config: Config;
    constructor(config: Config);
    onBoardInitialized(board: Board): void;
}
