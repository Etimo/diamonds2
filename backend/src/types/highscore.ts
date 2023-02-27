import { IBot } from "./bot";
import { ISeason } from "./season";

export interface IHighscore {
  id: string;
  score: number;
  createTimeStamp: Date;
  updateTimeStamp: Date;
  seasonId: string;
  botId: string;

  bot?: IBot;
  season?: ISeason;
}

export type INewHighscore = Omit<
  IHighscore,
  "id" | "createTimeStamp" | "updateTimeStamp" | "season" | "bot"
>;
export type IUpdateHighscore = Omit<IHighscore, "id" | "season" | "bot">;
