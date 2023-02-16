import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { BoardConfigDto } from "../models/board-config.dto";
import { PrismaService } from "./prisma.service";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class BoardConfigService {
  constructor(
    private prisma: PrismaService,
    private seasonsService: SeasonsService,
  ) {}

  public async getCurrentBoardConfig() {
    const currentSeason = await this.seasonsService.getCurrentSeason();
    const boardConfig = await this.prisma.boardConfig.findFirst({
      where: {
        seasonId: currentSeason.id,
      },
    });
    // const boardConfig = await this.repo
    //   .createQueryBuilder("board_config")
    //   .where("board_config.seasonId = :seasonId", {
    //     seasonId: currentSeason.id,
    //   })
    //   .getOne();

    // Temporary fallback since Slack command has not been added yet.
    // We will fetch boardConfig from Off season if we can't find one on current season.
    if (!boardConfig) {
      const currentSeason = await this.seasonsService.getOffSeason();
      return this.prisma.boardConfig.findFirst({
        where: {
          seasonId: currentSeason.id,
        },
      });
      // return await this.repo
      //   .createQueryBuilder("board_config")
      //   .where("board_config.seasonId = :seasonId", {
      //     seasonId: currentSeason.id,
      //   })
      //   .getOne();
    }

    return BoardConfigDto.fromEntity(boardConfig);
  }

  public async getBoardConfig(seasonId: string) {
    return this.prisma.boardConfig.findFirst({
      where: {
        seasonId,
      },
    });
    // const boardConfig = await this.repo
    //   .createQueryBuilder("board_config")
    //   .where("board_config.seasonId = :seasonId", { seasonId })
    //   .getOne();

    // return BoardConfigDto.fromEntity(boardConfig);
  }

  public async add(dto: BoardConfigDto) {
    // TODO: Add validation

    // Add the season
    return this.create(dto);
  }

  public async create(dto: BoardConfigDto) {
    return this.prisma.boardConfig.create({
      data: dto,
    });
    // return await this.repo
    //   .save(dto)
    //   .then(boardConfigEntity => BoardConfigDto.fromEntity(boardConfigEntity));
  }
}
