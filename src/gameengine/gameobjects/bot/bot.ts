import { IPosition } from "src/interfaces/position.interface";
import { AbstractGameObject } from "../game-object";

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
    toChar() {
        return "🤖";
    }

}