import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../services/prisma.service";
import { INewHighscore } from "../../types";

@Injectable()
export class HighscoresRepository {
  private entity: string = "high_scores";

  constructor(private prisma: PrismaService) {}

  public async allBySeasonIdRaw(
    seasonId: string,
    currentSeasonId: string,
    limit: number = 0,
  ) {
    const take = limit ? limit : seasonId === currentSeasonId ? 50 : 20;

    return this.prisma.highscore.findMany({
      where: {
        seasonId,
      },
      include: {
        bot: {
          include: {
            team: {
              select: {
                logotypeUrl: true,
              },
            },
          },
        },
      },
    });
  }

  public getBotScore(botName: string) {
    return this.prisma.highscore.findMany({
      where: {
        bot: {
          name: botName,
        },
      },
    });
  }

  public async getBestBotScore(botName: string, seasonId: string) {
    return this.prisma.highscore.findFirst({
      where: {
        bot: {
          name: botName,
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

  public async create(data: INewHighscore) {
    return this.prisma.highscore.create({
      data: {
        botId: data.botId,
        score: data.score,
        seasonId: data.seasonId,
      },
    });
    // return this.repo.save(dto);
  }

  public async delete(botId: string) {
    return this.prisma.highscore.deleteMany({
      where: {
        botId,
      },
    });
  }
}
