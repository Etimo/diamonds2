import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { BoardConfigDto } from "../models/board-config.dto";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class BoardConfigService {
  constructor(
    @InjectRepository(BoardConfigEntity)
    private readonly repo: Repository<BoardConfigEntity>,
    private seasonsService: SeasonsService,
  ) {}

  public async getCurrentBoardConfig() {
    const currentSeason = await this.seasonsService.getCurrentSeason();
    const boardConfig = await this.repo
      .createQueryBuilder("board_config")
      .where("board_config.seasonId = :seasonId", {
        seasonId: currentSeason.id,
      })
      .getOne();

    // Temporary fallback since Slack command has not been added yet.
    // We will fetch boardConfig from Off season if we can't find one on current season.
    if (!boardConfig) {
      const currentSeason = await this.seasonsService.getOffSeason();
      return await this.repo
        .createQueryBuilder("board_config")
        .where("board_config.seasonId = :seasonId", {
          seasonId: currentSeason.id,
        })
        .getOne();
    }

    return BoardConfigDto.fromEntity(boardConfig);
  }

  public async getBoardConfig(seasonId: string) {
    const boardConfig = await this.repo
      .createQueryBuilder("board_config")
      .where("board_config.seasonId = :seasonId", { seasonId })
      .getOne();

    return BoardConfigDto.fromEntity(boardConfig);
  }

  public async add(dto: BoardConfigDto) {
    // TODO: Add validation

    // Add the season
    return await this.create(dto);
  }

  public async create(dto: BoardConfigDto): Promise<BoardConfigDto> {
    return await this.repo
      .save(dto)
      .then(boardConfigEntity => BoardConfigDto.fromEntity(boardConfigEntity));
  }
}
