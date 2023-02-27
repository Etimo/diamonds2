import { Injectable } from "@nestjs/common";
import { URL } from "url";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import NotFoundError from "../errors/not-found.error";
import { INewTeam, ITeam } from "../types";
import { PrismaService } from "./prisma.service";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  public async all(): Promise<ITeam[]> {
    return this.prisma.team.findMany({
      orderBy: {
        createTimeStamp: "desc",
      },
    });
  }

  public async add(data: INewTeam): Promise<ITeam> {
    await this.validateInput(data);
    return await this.create(data);
  }

  public async getByAbbreviation(
    abbreviation: string,
  ): Promise<ITeam | undefined> {
    const team = await this.prisma.team.findFirst({
      where: {
        abbreviation,
      },
    });

    if (team) {
      return team;
    }
    throw new NotFoundError("Team does not exist");
  }

  private async create(data: INewTeam): Promise<ITeam> {
    return await this.prisma.team.create({
      data,
    });
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
        this.exist("name", data.name),
        this.exist("abbreviation", data.abbreviation),
        this.exist("logotypeUrl", data.logotypeUrl),
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

  private async exist(field: string, data: string): Promise<ITeam | undefined> {
    return await this.prisma.team.findFirst({
      where: {
        [field]: data,
      },
    });
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
