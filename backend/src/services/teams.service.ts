import { Injectable } from "@nestjs/common";
import { TeamDto } from "../models/team.dto";
import ForbiddenError from "../errors/forbidden.error";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { URL } from "url";
import { TeamsRepository } from "../db/repositories/teams.repository";

@Injectable()
export class TeamsService {
  constructor(private readonly repo: TeamsRepository) {}

  public async all() {
    return this.repo.all().then(teams => teams.map(e => TeamDto.fromEntity(e)));
  }

  public async add(dto: TeamDto) {
    await this.validateInput(dto);
    return await this.repo.create(dto);
  }

  public async getByAbbreviation(abbreviation: string): Promise<TeamDto> {
    const team = await this.repo.getByAbbreviation(abbreviation);

    if (team) {
      return TeamDto.fromEntity(team);
    }
    throw new NotFoundError("Team does not exist");
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
      this.repo.exist("teams.name", dto.name),
      this.repo.exist("teams.abbreviation", dto.abbreviation),
      this.repo.exist("teams.logotypeUrl", dto.logotypeUrl),
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
