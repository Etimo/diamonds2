import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";

@Injectable()
export class SeasonsService {
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

    const offSeason = await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.name = 'Off Season'")
      .getOne();

    return SeasonDto.fromEntity(offSeason);
  }

  public async all() {
    return this.repo
      .find({
        order: {
          createTimeStamp: "DESC",
        },
      })
      .then(highScores => highScores.map(e => SeasonDto.fromEntity(e)));
  }
}
