import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { IBoardConfig, INewBoardConfig } from "../../types";

@Injectable()
export class BoardConfigRepository {
  constructor(private prisma: PrismaService) {}

  public async getBoardConfigById(
    id: string,
  ): Promise<IBoardConfig | undefined> {
    return this.prisma.boardConfig.findFirst({
      where: {
        id: id,
      },
    });
  }

  public async create(dto: INewBoardConfig) {
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
}
