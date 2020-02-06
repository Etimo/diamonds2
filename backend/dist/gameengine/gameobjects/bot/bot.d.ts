import { IPosition } from "src/common/interfaces/position.interface";
import { AbstractGameObject } from "../abstract-game-object";
export declare class BotGameObject extends AbstractGameObject {
    base: IPosition;
    diamonds: number;
    timeJoined: Date;
    expiresAt: Date;
    inventorySize: number;
    score: number;
    name: string;
    nextMoveAvailableAt: Date;
    get properties(): {
        diamonds: number;
        score: number;
        nextMoveAvailableAt: Date;
        name: string;
        inventorySize: number;
        millisecondsLeft: number;
        timeJoined: Date;
        base: IPosition;
    };
}
