import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { IBot, INewBot } from "../../types";

@Injectable()
export class BotRegistrationsRepository {
  constructor(private prisma: PrismaService) {}

  public async create(dto: INewBot) {
    return this.prisma.bot.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        teamId: dto.teamId,
      },
    });
  }

  public async delete(bot: IBot): Promise<IBot> {
    return this.prisma.bot.delete({
      where: {
        name: bot.id,
      },
    });
  }

  public async getByEmail(email: string): Promise<IBot | undefined> {
    email = email.toLowerCase();

    return this.prisma.bot.findFirst({
      where: {
        email,
      },
    });
  }

  public async getByName(name: string): Promise<IBot | undefined> {
    name = name.toLowerCase();
    return this.prisma.bot.findFirst({
      where: {
        name,
      },
    });
  }

  public async get(id: string): Promise<IBot | undefined> {
    return this.prisma.bot.findFirst({
      where: {
        id,
      },
    });
  }
}
