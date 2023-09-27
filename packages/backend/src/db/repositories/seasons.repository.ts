import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { INewSeason, ISeason } from "../../types";

@Injectable()
export class SeasonsRepository {
  constructor(private prisma: PrismaService) {}

  public async create(data: INewSeason): Promise<ISeason> {
    return this.prisma.season.create({
      data: {
        endDate: data.endDate,
        name: data.name,
        startDate: data.startDate,
        boardConfigId: data.boardConfigId,
      },
    });
  }

  public async getById(
    seasonId: string,
    includeBoardConfig: boolean,
  ): Promise<ISeason> {
    const season = await this.prisma.season.findFirst({
      where: {
        id: seasonId,
      },
      include: {
        boardConfig: includeBoardConfig,
      },
    });

    return season!;
  }

  public async getCurrentSeason(): Promise<ISeason> {
    const currentSeason = await this.prisma.season.findFirst({
      where: {
        startDate: {
          lte: new Date(),
        },
        endDate: {
          gte: new Date(),
        },
      },
      include: {
        boardConfig: true,
      },
    });

    return currentSeason!;
  }

  public async getAll(): Promise<ISeason[]> {
    return this.prisma.season.findMany({
      orderBy: {
        createTimeStamp: "desc",
      },
    });
  }

  public async getByName(name: string): Promise<ISeason | null> {
    return this.prisma.season.findFirst({
      where: {
        name,
      },
    });
  }

  // Check if the new dates collides with other season dates.
  public async dateCollision(startDate: Date, endDate: Date) {
    return this.prisma.season.findFirst({
      where: {
        startDate: {
          lte: endDate,
        },
        endDate: {
          lte: startDate,
        },
      },
    });
  }
}
