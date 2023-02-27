import { Injectable } from "@nestjs/common";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { SeasonDto } from "../models/season.dto";
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
    // const offSeason = await this.repo
    //   .createQueryBuilder("seasons")
    //   .where("seasons.name = 'Off season'")
    //   .getOne();

    // return SeasonDto.fromEntity(offSeason);
  }

  public async getSeason(seasonId: SeasonDto["id"]) {
    return this.prisma.season.findFirst({
      where: {
        id: seasonId,
      },
    });
    // const offSeason = await this.repo
    //   .createQueryBuilder("seasons")
    //   .where("seasons.id = :seasonId", { seasonId: seasonId })
    //   .getOne();

    // return SeasonDto.fromEntity(offSeason);
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
    });
    // const currentSeason = await this.repo
    //   .createQueryBuilder("seasons")
    //   .where("seasons.startDate <= now() AND seasons.endDate >= now()")
    //   .getOne();

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
    // return this.repo
    //   .find({
    //     order: {
    //       createTimeStamp: "DESC",
    //     },
    //   })
    //   .then(seasons => seasons.map(e => SeasonDto.fromEntity(e)));
  }

  public async add(dto: SeasonDto) {
    // Return if values are missing
    if (!dto.name || !dto.startDate || !dto.endDate) {
      throw new ForbiddenError(
        "The body does not contain name, startDate or endDate.",
        "season_name",
      );
    }
    dto.endDate.setHours(23, 59, 59, 999); // Season ends at midnight

    // Return if startDate is larger then endDate.
    if (dto.startDate > dto.endDate) {
      throw new ForbiddenError(
        "The endDate is not larger then the startDate.",
        "end_date",
      );
    }

    let [dateCollision, nameExists] = await Promise.all([
      this.dateCollision(dto.startDate, dto.endDate),
      this.nameExists(dto.name),
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
    return await this.create(dto);
  }

  public async create(dto: SeasonDto) {
    return this.prisma.season.create({
      data: {
        endDate: dto.endDate,
        name: dto.name,
        startDate: dto.startDate,
      },
    });
    // return await this.repo
    //   .save(dto)
    //   .then(seasonEntity => SeasonDto.fromEntity(seasonEntity));
  }

  private async nameExists(name: string) {
    return this.prisma.season.findFirst({
      where: {
        name,
      },
    });
    // return await this.repo
    //   .createQueryBuilder("seasons")
    //   .where("seasons.name = :name", { name: name })
    //   .getOne();
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
    // return await this.repo
    //   .createQueryBuilder("seasons")
    //   .where(
    //     "seasons.startDate <= :endDate AND seasons.endDate >= :startDate",
    //     { endDate: endDate, startDate: startDate },
    //   )
    //   .getOne();
  }
}
