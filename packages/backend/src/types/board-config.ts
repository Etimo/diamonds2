import { ISeason } from "./season";

export interface IBoardConfig {
  id: string;
  inventorySize: number;
  canTackle: boolean;
  teleporters: number;
  teleportRelocation: number;
  height: number;
  width: number;
  minimumDelayBetweenMoves: number;
  sessionLength: number;
  separateBoards: boolean;
  dummyBots: number;
  createTimeStamp: Date;
  updateTimeStamp: Date;

  season?: ISeason;
}

export type INewBoardConfig = Partial<
  Omit<IBoardConfig, "id" | "createTimeStamp" | "updateTimeStamp" | "season">
>;
export type IUpdateBoardConfig = Omit<IBoardConfig, "id" | "season">;
