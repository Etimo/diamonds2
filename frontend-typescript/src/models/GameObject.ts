import { Position } from './Position';

export type GameObject = {
  type: string;
  position: Position;
  properties: { description: string };
};
