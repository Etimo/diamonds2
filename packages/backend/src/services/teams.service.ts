import { Injectable } from "@nestjs/common";
import { URL } from "url";
import { TeamsRepository } from "../db";
import { ConflictError, ForbiddenError, NotFoundError } from "../errors";
import { INewTeam, ITeam } from "../types";

@Injectable()
export class TeamsService {
  constructor(private repo: TeamsRepository) {}

  public async all(): Promise<ITeam[]> {
    return this.repo.all();
  }

  public async add(data: INewTeam): Promise<ITeam> {
    await this.validateInput(data);
    return await this.create(data);
  }

  public async getByAbbreviation(abbreviation: string): Promise<ITeam | null> {
    let team = this.repo.getByAbbreviation(abbreviation);

    if (team) {
      return team;
    }
    throw new NotFoundError("Team does not exist");
  }

  private async create(data: INewTeam): Promise<ITeam> {
    return await this.repo.create(data);
  }

  private async validateInput(data: INewTeam) {
    if (!data.name || !data.abbreviation || !data.logotypeUrl) {
      throw new ForbiddenError(
        "The body does not contain name, abbreviation or logotypeUrl.",
        "team_name",
      );
    }
    // Check if name, abbreviation or url already exist.
    // Separate checks to return proper error.
    let [nameExists, abbreviationExists, logotypeUrlExists] = await Promise.all(
      [
        this.repo.get("name", data.name),
        this.repo.get("abbreviation", data.abbreviation),
        this.repo.get("logotypeUrl", data.logotypeUrl),
      ],
    );

    const errorPayload = this.getErrorPayload(
      nameExists,
      abbreviationExists,
      logotypeUrlExists,
    );

    if (errorPayload) {
      throw new ConflictError(errorPayload.message, errorPayload.errorTag);
    }

    if (!this.isValidUrl(data.logotypeUrl)) {
      throw new ForbiddenError("Invalid url", "team_logotype_url");
    }
  }

  private getErrorPayload(
    nameExists: any,
    abbreviationExists: any,
    logotypeUrlExists: any,
  ) {
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

  private isValidUrl(url: string) {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
}
