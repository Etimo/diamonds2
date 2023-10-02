import { IBoardFeatureDto } from "./board-feature-dto";
import { IGameObjectDto } from "./game-object-dto";

export interface IBoardDto {
  id: number;
  width: number;
  height: number;
  minimumDelayBetweenMoves: number;
  gameObjects: IGameObjectDto[];
  features: IBoardFeatureDto[];
}
