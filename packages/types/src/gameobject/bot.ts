import { Position } from "../position";

export type BotGameObjectProperties = {
  base: Position;
  diamonds: number;
  timeJoined: Date;
  inventorySize: number;
  canTackle: boolean;
  score: number;
  name: string;
  nextMoveAvailableAt: Date;
  millisecondsLeft: number;
};

export type BotProviderConfig = {
  /**
   * The maximum number of diamonds a bot can carry at the same time.
   */
  inventorySize: number;
  /**
   * The bot can tackle other bots.
   */
  canTackle: boolean;
};
