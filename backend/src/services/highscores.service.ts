import { Injectable } from "@nestjs/common";
import { HighscorePrivateDto } from "../models/highscore-private.dto";
import { HighscorePublicDto } from "../models/highscore-public.dto";
import { IHighscore } from "../types";
import { PrismaService } from "./prisma.service";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class HighscoresService {
  constructor(
    private prisma: PrismaService,
    private seasonService: SeasonsService,
  ) {}

  public async addOrUpdate(input: IHighscore): Promise<boolean> {
    const seasonAllTimeBest = await this.getSeasonBestHighScore(input.seasonId);

    if (await this.isNewHighScore(input)) {
      await this.create(input);
    }

    return seasonAllTimeBest < input.score;
  }

  public async getBotScore(newScore: IHighscore) {
    return this.prisma.highscore.findMany({
      where: {
        botId: newScore.botId,
      },
      include: {
        bot: true,
      },
    });
  }

  private async isNewHighScore(newScore: IHighscore) {
    let isNew: boolean = true;
    const season = await this.seasonService.getCurrentSeason();

    const resultSetHighScore = await this.prisma.highscore.findFirst({
      where: {
        botId: newScore.botId,
        seasonId: newScore.seasonId,
      },
    });

    if (resultSetHighScore) {
      if (resultSetHighScore.score < newScore.score) {
        await this.prisma.highscore.update({
          data: {
            score: newScore.score,
          },
          where: {
            id: resultSetHighScore.id,
          },
        });
        isNew = false;
      } else {
        isNew = false;
      }
    }

    return isNew;
  }

  private async getSeasonBestHighScore(seasonId): Promise<number> {
    const existingBest = await this.allBySeasonId(seasonId, 1);
    if (existingBest.length === 0) {
      return 0;
    }
    return existingBest[0].score;
  }

  private async allBySeasonId(seasonId: string, limit: number = 0) {
    const currentSeason = await this.seasonService.getCurrentSeason();
    const take = limit ? limit : seasonId === currentSeason.id ? 50 : 20;

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

  public async allBySeasonIdPrivate(
    seasonId: string,
    limit: number = 0,
  ): Promise<HighscorePrivateDto[]> {
    const highScores = await this.allBySeasonId(seasonId, limit);
    return highScores.map((e) => ({
      botName: e.bot.name,
      email: e.bot.email,
      score: e.score,
    }));
  }

  public async allBySeasonIdPublic(
    seasonId: string,
  ): Promise<HighscorePublicDto[]> {
    const highScores = await this.allBySeasonId(seasonId);
    return highScores.map((e) => ({
      botName: e.bot.name,
      score: e.score,
      seasonId: e.seasonId,
      teamLogotype: e.bot.team.logotypeUrl,
    }));
  }

  public async create(data: IHighscore) {
    return this.prisma.highscore.create({
      data: {
        score: data.score,
        botId: data.botId,
        seasonId: data.seasonId,
      },
    });
  }

  public async deleteFor(botId: string) {
    return this.prisma.highscore.deleteMany({
      where: {
        botId,
      },
    });
  }
}
