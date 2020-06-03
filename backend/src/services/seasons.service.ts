import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { ISeason } from "../interfaces/season.interface";
import { SeasonDto } from "src/models/season.dto";
import ConflictError from "../errors/conflict.error";

@Injectable()
export class SeasonsService {
  private seasons: ISeason[] = [];

  constructor(
    @InjectRepository(SeasonsEntity)
    private readonly repo: Repository<SeasonsEntity>,
  ) {}

  public async getCurrentSeason() {
    const currentSeason = await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.startDate <= now() AND seasons.endDate >= now()")
      .getOne();

    if (currentSeason) {
      return SeasonDto.fromEntity(currentSeason);
    }
    return SeasonDto.offSeason();
  }

  public async all() {
    let seasons = this.repo
      .find({
        order: {
          createTimeStamp: "DESC",
        },
      })
      .then(highScores => highScores.map(e => SeasonDto.fromEntity(e)));
    // Adding offseason
    (await seasons).push(SeasonDto.offSeason());
    return seasons;
  }
}
