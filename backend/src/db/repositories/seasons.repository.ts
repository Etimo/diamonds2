import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SeasonDto } from "../../models/season.dto";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../models/seasons.entity";

@Injectable()
export class SeasonsRepository {
  constructor(
    @InjectRepository(SeasonsEntity)
    private readonly repo: Repository<SeasonsEntity>,
  ) {}

  public async create(dto: SeasonDto): Promise<SeasonsEntity> {
    return await this.repo.save(dto);
  }

  public async nameExists(name: string) {
    return await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.name = :name", { name: name })
      .getOne();
  }
  // Check if the new dates collides with other season dates.
  public async dateCollision(startDate: Date, endDate: Date) {
    return await this.repo
      .createQueryBuilder("seasons")
      .where(
        "seasons.startDate <= :endDate AND seasons.endDate >= :startDate",
        { endDate: endDate, startDate: startDate },
      )
      .getOne();
  }

  public async getOffSeason() {
    return await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.name = 'Off season'")
      .getOne();
  }

  public async getSeason(seasonId: string): Promise<SeasonsEntity> {
    return await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.id = :seasonId", { seasonId })
      .getOne();
  }

  public async getCurrentSeason() {
    return await this.repo
      .createQueryBuilder("seasons")
      .where("seasons.startDate <= now() AND seasons.endDate >= now()")
      .getOne();
  }

  public async all() {
    return this.repo.find({
      order: {
        createTimeStamp: "DESC",
      },
    });
  }
}
