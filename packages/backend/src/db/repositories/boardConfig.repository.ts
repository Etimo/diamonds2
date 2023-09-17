import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { IBoardConfig, INewBoardConfig } from "../../types";

@Injectable()
export class BoardConfigRepository {
  constructor(private prisma: PrismaService) {}

  public async getBoardConfigById(id: string): Promise<IBoardConfig | null> {
    return this.prisma.boardConfig.findFirst({
      where: {
        id: id,
      },
    });
  }

  public async create(newBoardConfig: INewBoardConfig): Promise<IBoardConfig> {
    return this.prisma.boardConfig.create({
      data: {
        canTackle: newBoardConfig.canTackle,
        height: newBoardConfig.height,
        inventorySize: newBoardConfig.inventorySize,
        minimumDelayBetweenMoves: newBoardConfig.minimumDelayBetweenMoves,
        teleporters: newBoardConfig.teleporters,
        teleportRelocation: newBoardConfig.teleportRelocation,
        width: newBoardConfig.width,
        sessionLength: newBoardConfig.sessionLength,
        separateBoards: newBoardConfig.separateBoards,
      },
    });
  }
}
