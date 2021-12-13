import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { BotRegistrationDto } from "../../models/bot-registration.dto";
import { TeamDto } from "../../models/team.dto";
import { TeamsEntity } from "../models/teams.entity";

@Injectable()
export class TeamsRepository {
  constructor(
    @InjectRepository(TeamsEntity)
    private readonly repo: Repository<TeamsEntity>,
  ) {}

  public async all() {
    return this.repo.find({
      order: {
        createTimeStamp: "DESC",
      },
    });
  }

  public async create(team: TeamDto): Promise<TeamsEntity> {
    return this.repo.create(team);
  }

  public async getByAbbreviation(abbreviation: string): Promise<TeamsEntity> {
    return this.repo
      .createQueryBuilder("teams")
      .where("teams.abbreviation = :abbreviation", {
        abbreviation,
      })
      .getOne();
  }

  public async exist(field: string, data: string): Promise<TeamsEntity> {
    return this.repo
      .createQueryBuilder("teams")
      .where(`${field} = :string`, { string: data })
      .getOne();
  }
}
