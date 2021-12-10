import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { SeasonsRepository } from "../db/repositories/seasons.repository";

@Injectable()
export class SeasonsService {
  constructor(private readonly repo: SeasonsRepository) {}

  public async getOffSeason() {
    return SeasonDto.fromEntity(await this.repo.getOffSeason());
  }

  public async getSeason(seasonId: SeasonDto["id"]): Promise<SeasonDto> {
    return SeasonDto.fromEntity(await this.repo.getSeason(seasonId));
  }

  public async getCurrentSeason() {
    const currentSeason = await this.repo.getCurrentSeason();

    if (currentSeason) {
      return SeasonDto.fromEntity(currentSeason);
    }

    return await this.getOffSeason();
  }

  public async all() {
    return (await this.repo.all()).map(e => SeasonDto.fromEntity(e));
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

    const [dateCollision, nameExists] = await Promise.all([
      this.repo.dateCollision(dto.startDate, dto.endDate),
      this.repo.nameExists(dto.name),
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
    return SeasonDto.fromEntity(await this.repo.create(dto));
  }
}
