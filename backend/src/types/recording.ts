import { IBot } from "./bot";
import { ISeason } from "./season";

export interface IRecording {
  id: string;
  score: number;
  board: number;
  createTimeStamp: Date;
  recording: string;
  botId: string;
  seasonId: string;

  bot?: IBot;
  season?: ISeason;
}

export type INewRecording = Omit<
  IRecording,
  "id" | "createTimeStamp" | "bot" | "season"
>;
export type IUpdateRecording = Omit<IRecording, "id" | "bot" | "season">;
