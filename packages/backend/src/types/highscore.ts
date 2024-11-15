import { IBot } from "./bot.ts";
import { ISeason } from "./season.ts";
import { ITeam } from "./team.ts";

export interface IHighscore {
  id: string;
  score: number;
  createTimeStamp: Date;
  updateTimeStamp: Date;
  seasonId: string;
  botId: string;

  bot?: IBot;
  season?: ISeason;
  team?: ITeam;
}

export type INewHighscore = Omit<
  IHighscore,
  "id" | "createTimeStamp" | "updateTimeStamp" | "season" | "bot" | "team"
>;
export type IUpdateHighscore = Omit<
  IHighscore,
  "id" | "season" | "bot" | "team"
>;
