import { Injectable } from "@nestjs/common";
import { BoardConfigRepository } from "../db";
import { INewBoardConfig } from "../types";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class BoardConfigService {
  constructor(
    private seasonsService: SeasonsService,
    private repo: BoardConfigRepository,
  ) {}

  public async getCurrentBoardConfig() {
    const season = await this.seasonsService.getCurrentSeason();
    return this.repo.getBoardConfigById(season.boardConfigId);
  }

  public async getBoardConfig(seasonId: string) {
    return this.repo.getBoardConfigById(seasonId);
  }

  public async add(dto: INewBoardConfig) {
    return this.repo.create(dto);
  }
}
