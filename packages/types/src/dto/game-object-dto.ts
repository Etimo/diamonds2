import type {
  BaseGameObjectProperties,
  BotGameObjectProperties,
  DiamondGameObjectProperties,
  TeleportProperties,
} from "../gameobject/index.ts";
import type { Position } from "../position.ts";

export interface IBotGameObjectDto {
  type: "BotGameObject" | "DummyBotGameObject";
  position: Position;
  properties: BotGameObjectProperties;
}

export interface IDiamondGameObjectDto {
  type: "DiamondGameObject";
  position: Position;
  properties: DiamondGameObjectProperties;
}

export interface IDiamondButtonGameObjectDto {
  type: "DiamondButtonGameObject";
  position: Position;
  properties: Record<string | number | symbol, never>;
}

export interface IBaseGameObjectDto {
  type: "BaseGameObject";
  position: Position;
  properties: BaseGameObjectProperties;
}

export interface ITeleportGameObjectDto {
  type: "TeleportGameObject";
  position: Position;
  properties: TeleportProperties;
}

export type IGameObjectDto =
  | IBotGameObjectDto
  | IDiamondGameObjectDto
  | IDiamondButtonGameObjectDto
  | IBaseGameObjectDto
  | ITeleportGameObjectDto;
