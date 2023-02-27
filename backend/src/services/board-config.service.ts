import { Injectable } from "@nestjs/common";
import { BoardConfigDto } from "../models/board-config.dto";
import { INewBoardConfig } from "../types";
import { PrismaService } from "./prisma.service";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class BoardConfigService {
  constructor(
    private prisma: PrismaService,
    private seasonsService: SeasonsService,
  ) {}

  public async getCurrentBoardConfig() {
    const season = await this.seasonsService.getCurrentSeason();
    return this.prisma.boardConfig.findFirst({
      where: {
        id: season.boardConfigId,
      },
    });
    // const boardConfig = await this.prisma.boardConfig.findFirst({
    //   where: {
    //     s,
    //   },
    // });
    // // const boardConfig = await this.repo
    // //   .createQueryBuilder("board_config")
    // //   .where("board_config.seasonId = :seasonId", {
    // //     seasonId: currentSeason.id,
    // //   })
    // //   .getOne();

    // // Temporary fallback since Slack command has not been added yet.
    // // We will fetch boardConfig from Off season if we can't find one on current season.
    // if (!boardConfig) {
    //   const currentSeason = await this.seasonsService.getOffSeason();
    //   return this.prisma.boardConfig.findFirst({
    //     where: {
    //       seasonId: currentSeason.id,
    //     },
    //   });
    //   // return await this.repo
    //   //   .createQueryBuilder("board_config")
    //   //   .where("board_config.seasonId = :seasonId", {
    //   //     seasonId: currentSeason.id,
    //   //   })
    //   //   .getOne();
    // }

    // return BoardConfigDto.fromEntity(boardConfig);
  }

  public async getBoardConfig(seasonId: string) {
    const season = await this.prisma.season.findFirst({
      where: {
        id: seasonId,
      },
      include: {
        boardConfig: true,
      },
    });
    return {
      ...season.boardConfig,
      seasonId,
    };
  }

  public async add(dto: INewBoardConfig) {
    // TODO: Add validation

    // Add the season
    return this.prisma.boardConfig.create({
      data: {
        canTackle: dto.canTackle,
        height: dto.height,
        inventorySize: dto.inventorySize,
        minimumDelayBetweenMoves: dto.minimumDelayBetweenMoves,
        teleporters: dto.teleporters,
        teleportRelocation: dto.teleportRelocation,
        width: dto.width,
        sessionLength: dto.sessionLength,
      },
    });
  }

  public async create(dto: BoardConfigDto) {
    return this.prisma.boardConfig.create({
      data: dto,
    });
  }
}
