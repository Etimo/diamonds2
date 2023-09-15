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
        teamId: dto.teamId ?? undefined,
      },
    });
  }

  public async delete(bot: IBot): Promise<IBot> {
    return (await this.prisma.bot.delete({
      where: {
        id: bot.id,
      },
    })) as IBot;
  }

  public async getByEmail(email: string): Promise<IBot | null> {
    email = email.toLowerCase();

    return (await this.prisma.bot.findFirst({
      where: {
        email,
      },
    })) as IBot | null;
  }

  public async getByName(name: string): Promise<IBot | null> {
    name = name.toLowerCase();
    return (await this.prisma.bot.findFirst({
      where: {
        name,
      },
    })) as IBot | null;
  }

  public async get(id: string): Promise<IBot | null> {
    return (await this.prisma.bot.findFirst({
      where: {
        id,
      },
    })) as IBot | null;
  }
}
