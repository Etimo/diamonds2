import { IBot } from "./bot";

export interface ITeam {
  id: string;
  name: string;
  abbreviation: string;
  logotypeUrl: string;
  createTimeStamp: Date;
  updateTimeStamp: Date;

  bots?: IBot[];
}

export type INewTeam = Omit<
  ITeam,
  "id" | "createTimeStamp" | "updateTimeStamp" | "bots"
>;
export type IUpdateTeam = Omit<ITeam, "id" | "bots">;
