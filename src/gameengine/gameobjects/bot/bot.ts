import { IPosition } from "src/common/interfaces/position.interface";
import { AbstractGameObject } from "../abstract-game-object";

export interface BoardBot {
    base: IPosition;
    position: IPosition;
    diamonds: number;
    timeJoined: Date;
    millisecondsLeft: number;
    score: number;
    botId: string;
    nextMoveAvailableAt: Date;
}

const BOT_AVATARS = "🤖🦁🐙🦑🦀🐌🐥🦞🐭🐹🐰🐶🐺🦊🐵🐸🙊🐯🦁🐮🐷🐻🐼🐲🐨🦄";

export class BotGameObject extends AbstractGameObject {
    public readonly type: string = "bot";

    toChar() {
        return "Q";
    }

    base: IPosition;
    diamonds: number = 0;
    timeJoined: Date;
    millisecondsLeft: number;
    score: number = 0;
    botId: string;
    nextMoveAvailableAt: Date;

}