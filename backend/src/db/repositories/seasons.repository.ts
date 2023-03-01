import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { INewSeason } from "../../types";

@Injectable()
export class SeasonsRepository{
    constructor(private prisma: PrismaService){}

    public async create(data: INewSeason) {
        return this.prisma.season.create({
          data: {
            endDate: data.endDate,
            name: data.name,
            startDate: data.startDate,
            boardConfigId: data.boardConfigId,
          },
        });
    }

    public async getById(seasonId: string, includeBoardConfig: boolean) {
      return this.prisma.season.findFirst({
        where: {
          id: seasonId,
        },
        include: {
          boardConfig: includeBoardConfig,
        },
      });
    }

    public async getOffSeason() {
        return this.getById("00000000-0000-0000-0000-000000000000", false);
    }

    public async getCurrentSeason() {
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

        if (currentSeason) {
          return currentSeason;
        }

        return this.getOffSeason();
    }

    public async getAll() {
      return this.prisma.season.findMany({
        orderBy: {
          createTimeStamp: "desc",
        },
      });
    }

    public async nameExists(name: string) {
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
