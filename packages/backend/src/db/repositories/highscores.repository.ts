import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { IHighscore, INewHighscore } from "../../types";

@Injectable()
export class HighscoresRepository {
  private entity: string = "high_scores";

  constructor(private prisma: PrismaService) {}

  public async allBySeasonIdRaw(
    seasonId: string,
    currentSeasonId: string,
    limit: number = 0,
  ): Promise<IHighscore[]> {
    const take = limit ? limit : seasonId === currentSeasonId ? 50 : 20;

    return (await this.prisma.highscore.findMany({
      where: {
        seasonId,
      },
      include: {
        bot: {
          include: {
            team: {
              select: {
                name: true,
                logotypeUrl: true,
              },
            },
          },
        },
      },
      take: take,
      orderBy: {
        score: "desc",
      },
    })) as IHighscore[];
  }

  public getBotScore(botName: string): Promise<IHighscore[]> {
    return this.prisma.highscore.findMany({
      where: {
        bot: {
          name: botName,
        },
      },
    });
  }

  public async getBestBotScore(
    botId: string,
    seasonId: string,
  ): Promise<IHighscore | null> {
    return this.prisma.highscore.findFirst({
      where: {
        bot: {
          id: botId,
        },
        seasonId,
      },
    });
  }

  public async updateBestBotScore(
    botId: string,
    seasonId: string,
    score: number,
  ) {
    await this.prisma.highscore.update({
      data: {
        score,
      },
      where: {
        seasonId_botId: {
          botId,
          seasonId,
        },
      },
    });
  }

  public async create(data: INewHighscore): Promise<IHighscore> {
    return this.prisma.highscore.create({
      data: {
        botId: data.botId,
        score: data.score,
        seasonId: data.seasonId,
      },
    });
  }

  public async delete(botId: string) {
    return this.prisma.highscore.deleteMany({
      where: {
        botId,
      },
    });
  }
}
