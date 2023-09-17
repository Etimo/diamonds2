import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { INewTeam, ITeam } from "../../types";

@Injectable()
export class TeamsRepository {
  constructor(private prisma: PrismaService) {}

  public async all(): Promise<ITeam[]> {
    return this.prisma.team.findMany({
      orderBy: {
        createTimeStamp: "desc",
      },
    });
  }

  public async getByAbbreviation(abbreviation: string): Promise<ITeam | null> {
    const team = await this.prisma.team.findFirst({
      where: {
        abbreviation,
      },
    });
    return team;
  }

  public async create(data: INewTeam): Promise<ITeam> {
    return await this.prisma.team.create({
      data,
    });
  }

  public async get(field: string, data: string): Promise<ITeam | null> {
    return this.prisma.team.findFirst({
      where: {
        [field]: data,
      },
    });
  }
}
