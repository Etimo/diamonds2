import { Injectable } from "@nestjs/common";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { INewSeason } from "../types";
import { offSeasonId } from "../utils/slack/utils";

@Injectable()
export class SeasonsService {
  constructor(private repo: SeasonsRepository) {}

  public async getOffSeason() {
    return this.repo.getById(offSeasonId, false);
  }

  public async getSeason(seasonId: string) {
    return this.repo.getById(seasonId, true);
  }

  public async getCurrentSeason() {
    let currentSeason = this.repo.getCurrentSeason();
    if (currentSeason) {
      return currentSeason;
    }

    return this.getOffSeason();
  }

  public async all() {
    return this.repo.getAll();
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
      this.repo.dateCollision(data.startDate, data.endDate),
      this.repo.getByName(data.name),
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
    return this.repo.create(data);
  }
}
