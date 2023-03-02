import { Injectable } from "@nestjs/common";
import { BoardConfigRepository } from "../db/repositories/boardConfig.repository";
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
    return this.repo.getBoardConfigById(seasonId);
  }

  public async add(dto: INewBoardConfig) {
    // TODO: Add validation

    // Add the season
    return this.repo.create(dto);
  }

  // public async create(dto: BoardConfigDto) {
  //   return this.repo.create(dto);
  // }
}
