import { IBoardConfig } from "./board-config.ts";
import { IHighscore } from "./highscore.ts";
import { IRecording } from "./recording.ts";

export interface ISeason {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  createTimeStamp: Date;
  updateTimeStamp: Date;
  boardConfigId: string;

  highscores?: IHighscore[];
  recordings?: IRecording[];
  boardConfig?: IBoardConfig;
}

export type INewSeason = Omit<
  ISeason,
  | "id"
  | "createTimeStamp"
  | "updateTimeStamp"
  | "highscores"
  | "recordings"
  | "boardConfig"
>;
export type IUpdateSeason = Omit<
  ISeason,
  "id" | "highscores" | "recordings" | "boardConfig"
>;
