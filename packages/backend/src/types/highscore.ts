import { IBot } from "./bot";
import { ISeason } from "./season";
import { ITeam } from "./team";

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
