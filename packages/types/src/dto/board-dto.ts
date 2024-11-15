import type { IBoardFeatureDto } from "./board-feature-dto.ts";
import type { IGameObjectDto } from "./game-object-dto.ts";

export interface IBoardDto {
  id: number;
  width: number;
  height: number;
  minimumDelayBetweenMoves: number;
  gameObjects: IGameObjectDto[];
  features: IBoardFeatureDto[];
}
