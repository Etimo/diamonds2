import { Injectable } from "@nestjs/common";
import { BoardConfigRepository } from "../db/repositories/board-config.repository";
import { BoardConfigDto } from "../models/board-config.dto";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class BoardConfigService {
  constructor(
    private readonly repo: BoardConfigRepository,
    private seasonsService: SeasonsService,
  ) {}

  public async getCurrentBoardConfig() {
    const currentSeason = await this.seasonsService.getCurrentSeason();
    const boardConfig = await this.repo.getForSeason(currentSeason.id);

    // Temporary fallback since Slack command has not been added yet.
    // We will fetch boardConfig from Off season if we can't find one on current season.
    if (!boardConfig) {
      const offSeason = await this.seasonsService.getOffSeason();
      return BoardConfigDto.fromEntity(
        await this.repo.getForSeason(offSeason.id),
      );
    }

    return BoardConfigDto.fromEntity(boardConfig);
  }

  public async add(dto: BoardConfigDto) {
    // TODO: Add validation

    // Add the season
    return await this.create(dto);
  }

  public async create(dto: BoardConfigDto): Promise<BoardConfigDto> {
    return BoardConfigDto.fromEntity(await this.repo.create(dto));
  }
}
