import { PositionDto } from "./position.dto";
export declare class BotDto {
    name: string;
    base: PositionDto;
    position: PositionDto;
    diamonds: number;
    timeJoined: Date;
    millisecondsLeft: number;
    score: number;
    botId: string;
    nextMoveAvailableAt: Date;
}
