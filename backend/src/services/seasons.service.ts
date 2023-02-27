import { Injectable } from "@nestjs/common";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { INewSeason } from "../types";
import { PrismaService } from "./prisma.service";

@Injectable()
export class SeasonsService {
  constructor(private prisma: PrismaService) {}

  public async getOffSeason() {
    return this.prisma.season.findFirst({
      where: {
        id: "00000000-0000-0000-0000-000000000000",
      },
    });
  }

  public async getSeason(seasonId: string) {
    return this.prisma.season.findFirst({
      where: {
        id: seasonId,
      },
      include: {
        boardConfig: true,
      },
    });
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

  public async all() {
    return this.prisma.season.findMany({
      orderBy: {
        createTimeStamp: "desc",
      },
    });
  }

  public async add(data: INewSeason) {
    // Return if values are missing
    if (!data.name || !data.startDate || !data.endDate) {
      throw new ForbiddenError(
        "The body does not contain name, startDate or endDate.",
        "season_name",
      );
    }
    data.endDate.setHours(23, 59, 59, 999); // Season ends at midnight

    // Return if startDate is larger then endDate.
    if (data.startDate > data.endDate) {
      throw new ForbiddenError(
        "The endDate is not larger then the startDate.",
        "end_date",
      );
    }

    let [dateCollision, nameExists] = await Promise.all([
      this.dateCollision(data.startDate, data.endDate),
      this.nameExists(data.name),
    ]);

    if (dateCollision) {
      throw new ConflictError(
        "The selected dates collides with another season.",
        "start_date",
      );
    }

    if (nameExists) {
      throw new ConflictError(
        "The selected name does already exist.",
        "season_name",
      );
    }

    // Add the season
    return await this.create(data);
  }

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

  private async nameExists(name: string) {
    return this.prisma.season.findFirst({
      where: {
        name,
      },
    });
  }

  // Check if the new dates collides with other season dates.
  private async dateCollision(startDate: Date, endDate: Date) {
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
