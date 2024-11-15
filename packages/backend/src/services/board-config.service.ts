import { Injectable } from "@nestjs/common";
import { BoardConfigRepository } from "../db/index.ts";
import { INewBoardConfig } from "../types/index.ts";
import { SeasonsService } from "./seasons.service.ts";

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
