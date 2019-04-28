import { IDiamond } from "./diamond.interface";
import { IBot } from "./bot.interface";

export interface IBoard {
    width: number;
    height: number;
    minimumDelayBetweenMoves: number;
    id: string;
    bots: IBot[];
    diamonds: IDiamond[];
    gameObjects: IGameObject[];
}