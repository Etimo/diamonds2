import { IDiamond } from "./diamond.interface";
import { IBot } from "./bot.interface";
import { IGameObject } from "./game-object.interface";

export interface IBoard {
  width: number;
  height: number;
  minimumDelayBetweenMoves: number;
  id: string;
  bots: IBot[];
  diamonds: IDiamond[];
  gameObjects: IGameObject[];
}
