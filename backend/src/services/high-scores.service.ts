import { Injectable } from "@nestjs/common";
import { HighscorePrivateDto } from "../models/highscore-private.dto";
import { HighscorePublicDto } from "../models/highscore-public.dto";
import { HighscoreDto } from "../models/highscore.dto";
import { PrismaService } from "./prisma.service";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class HighScoresService {
  //no db
  private highScores: HighscoreDto[] = [];
  private entityHighScores: string = "highScores";

  constructor(
    private prisma: PrismaService,
    private seasonService: SeasonsService,
  ) {}

  public async addOrUpdate(input: HighscoreDto): Promise<boolean> {
    const seasonAllTimeBest = await this.getSeasonBestHighScore(input.seasonId);

    if (await this.isNewHighScore(input)) {
      await this.create(input);
    }

    return seasonAllTimeBest < input.score;
  }

  public async getBotScore(newScore: HighscoreDto) {
    const bot = await this.prisma.bot.findFirst({
      where: {
        name: newScore.name,
      },
    });
    return this.prisma.highScore
      .findMany({
        where: {
          botToken: bot.token,
        },
        include: {
          bot: true,
        },
      })
      .then((highscores) =>
        highscores.map((highscore) => HighscoreDto.fromEntity(highscore)),
      );
    // return this.repo
    //   .find({
    //     where: [{ botName: newScore.botName }],
    //   })
    //   .then(highScores => highScores.map(e => HighscoreDto.fromEntity(e)));
  }

  private async isNewHighScore(newScore: HighscoreDto) {
    let isNew: boolean = true;
    const season = await this.seasonService.getCurrentSeason();

    const resultSetHighScore = await this.prisma.highScore.findFirst({
      where: {
        bot: {
          name: newScore.name,
        },
        seasonId: newScore.seasonId,
      },
    });
    // const resultSetHighScore = await this.repo
    //   .createQueryBuilder(this.entityHighScores)
    //   .where(
    //     "highScores.botName = :botName AND highScores.seasonId = :seasonId",
    //     {
    //       botName: newScore.name,
    //       seasonId: season.id,
    //     },
    //   )
    //   .getOne();

    if (resultSetHighScore) {
      if (resultSetHighScore.score < newScore.score) {
        await this.prisma.highScore.update({
          data: {
            score: newScore.score,
          },
          where: {
            id: resultSetHighScore.id,
          },
        });
        // await this.repo
        //   .createQueryBuilder()
        //   .update("high_scores")
        //   .set({ score: newScore.score })
        //   .where("botName = :botName AND seasonId = :seasonId", {
        //     botName: newScore.name,
        //     seasonId: season.id,
        //   })
        //   .execute();
        isNew = false;
      } else {
        isNew = false;
      }
    }

    return isNew;
  }

  private async getSeasonBestHighScore(seasonId): Promise<number> {
    const existingBest = await this.allBySeasonIdRaw(seasonId, 1);
    if (existingBest.length === 0) {
      return 0;
    }
    return existingBest[0].score;
  }

  private async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    const currentSeason = await this.seasonService.getCurrentSeason();
    const take = limit ? limit : seasonId === currentSeason.id ? 50 : 20;

    return this.prisma.highScore.findMany({
      where: {
        seasonId,
      },
      include: {
        bot: {
          select: {
            name: true,
          },
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
    // Using joins to fetch logotypeUrl that related to the bots team.
    // const highScores = await this.repo
    //   .createQueryBuilder(this.entityHighScores)
    //   .select(this.entityHighScores)
    //   .where("highScores.seasonId = :seasonId", { seasonId: seasonId })
    //   .leftJoinAndSelect(
    //     BotRegistrationsEntity,
    //     "bot",
    //     "highScores.botName = bot.botName",
    //   )
    //   .leftJoinAndSelect(TeamsEntity, "teams", "bot.team = teams.id")
    //   .orderBy("score", "DESC")
    //   .limit(take)
    //   .execute();

    // return highScores;
  }

  public async allBySeasonIdPrivate(seasonId: string, limit: number = 0) {
    const highScores = await this.allBySeasonIdRaw(seasonId, limit);
    return highScores.map((e) => HighscorePrivateDto.fromRawDataObject(e));
  }

  public async allBySeasonIdPublic(seasonId: string) {
    const highScores = await this.allBySeasonIdRaw(seasonId);
    return highScores.map((e) => HighscorePublicDto.fromRawDataObject(e));
  }

  public async create(dto: HighscoreDto): Promise<HighscoreDto> {
    return this.repo.save(dto);
  }

  public async delete(dto: HighscoreDto) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .from("high_scores")
      .where("botName = :botName", { botName: dto.name })
      .execute();
  }
}
