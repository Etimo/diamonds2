import { AbstractGameObjectProvider } from "../abstract-game-object-providers";
import { IBot } from "src/interfaces/bot.interface";
import { Board } from "src/gameengine/board";
import { BotGameObject } from "./bot";
import { IPosition } from "src/common/interfaces/position.interface";
export interface Config {
    inventorySize: number;
}
export declare class BotProvider extends AbstractGameObjectProvider {
    protected config: Config;
    constructor(config: Config);
    onBotJoined(bot: IBot, board: Board): void;
    protected getInitializedBot(data: IBot, base: IPosition, board: Board): BotGameObject;
}
