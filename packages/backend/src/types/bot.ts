import { IHighscore } from "./highscore.ts";
import { IRecording } from "./recording.ts";
import { ITeam } from "./team.ts";

export interface IBot {
  id: string;
  name: string;
  email: string;
  createTimeStamp: Date;
  updateTimeStamp: Date;
  password: string;
  teamId: string | null;

  team?: ITeam;
  highscores?: IHighscore[];
  recordings?: IRecording[];
}

export type INewBot = Omit<
  IBot,
  "id" | "createTimeStamp" | "updateTimeStamp" | "highscores" | "recordings"
>;
export type IUpdateBot = Omit<
  IBot,
  "id" | "team" | "highscores" | "recordings"
>;
