import { BoardFeature } from './BoardFeature';
import { GameObject } from './GameObject';

export type Board = {
  id: string;
  height: number;
  width: number;
  minimumDelayBetweenMoves: number;
  gameObjects: GameObject[];
  features: BoardFeature[];
};
