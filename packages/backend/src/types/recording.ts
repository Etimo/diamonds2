import { IBot } from "./bot.ts";
import { ISeason } from "./season.ts";

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

export type ISaveRecording = Omit<
  IRecording,
  "id" | "createTimeStamp" | "bot" | "season" | "recording"
>;

export type IUpdateRecording = Omit<IRecording, "id" | "bot" | "season">;
