import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { TeamsEntity } from "../db/models/teams.entity";
import { TeamDto } from "../models/team.dto";
import ForbiddenError from "../errors/forbidden.error";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { URL } from "url";

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamsEntity)
    private readonly repo: Repository<TeamsEntity>,
  ) {}

  public async all() {
    return this.repo
      .find({
        order: {
          createTimeStamp: "DESC",
        },
      })
      .then(teams => teams.map(e => TeamDto.fromEntity(e)));
  }

  public async add(dto: TeamDto) {
    await this.validateInput(dto);
    return await this.create(dto);
  }

  public async getByAbbreviation(abbreviation: string): Promise<TeamDto> {
    const team = await this.repo
      .createQueryBuilder("teams")
      .where("teams.abbreviation = :abbreviation", {
        abbreviation: abbreviation,
      })
      .getOne();

    if (team) {
      return TeamDto.fromEntity(team);
    }
    throw new NotFoundError("Team does not exist");
  }

  private async create(dto: TeamDto): Promise<TeamDto> {
    return await this.repo
      .save(dto)
      .then(teamEntity => TeamDto.fromEntity(teamEntity));
  }

  private async validateInput(dto: TeamDto) {
    if (!dto.name || !dto.abbreviation || !dto.logotypeUrl) {
      throw new ForbiddenError(
        "The body does not contain name, abbreviation or logotypeUrl.",
        "team_name",
      );
    }
    // Check if name, abbreviation or url already exist.
    // Separate checks to return proper error.
    let [
      nameExists,
      abbreviationExists,
      logotypeUrlExists,
    ] = await Promise.all([
      this.exist("teams.name", dto.name),
      this.exist("teams.abbreviation", dto.abbreviation),
      this.exist("teams.logotypeUrl", dto.logotypeUrl),
    ]);

    const errorPayload = this.getErrorPayload(
      nameExists,
      abbreviationExists,
      logotypeUrlExists,
    );

    if (errorPayload) {
      throw new ConflictError(errorPayload.message, errorPayload.errorTag);
    }

    if (!this.isValidUrl(dto.logotypeUrl)) {
      throw new ForbiddenError("Invalid url", "team_logotype_url");
    }
  }

  private async exist(field: string, data: string): Promise<TeamDto> {
    return await this.repo
      .createQueryBuilder("teams")
      .where(`${field} = :string`, { string: data })
      .getOne();
  }

  private getErrorPayload(nameExists, abbreviationExists, logotypeUrlExists) {
    if (nameExists) {
      return { message: "Name does already exist", errorTag: "team_name" };
    }

    if (abbreviationExists) {
      return {
        message: "Abbreviation does already exist",
        errorTag: "team_abbreviation",
      };
    }

    if (logotypeUrlExists) {
      return {
        message: "LogotypeUrl does already exist",
        errorTag: "team_logotype_url",
      };
    }
    return false;
  }

  private isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
