import { Injectable } from "@nestjs/common";
import { HighscoreDto } from "../../models/highscore.dto";
import { PrismaService } from "../../services/prisma.service";

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

    return this.prisma.highScore.findMany({
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
    // Using joins to fetch logotypeUrl that related to the bots team.
    // const highScores = await this.repo
    //   .createQueryBuilder(this.entity)
    //   .select(this.entity)
    //   .where("highScores.seasonId = :seasonId", { seasonId: seasonId })
    //   .leftJoinAndSelect(
    //     BotRegistrationsEntity,
    //     "bot",
    //     "high_scores.botName = bot.botName",
    //   )
    //   .leftJoinAndSelect(TeamsEntity, "teams", "bot.team = teams.id")
    //   .orderBy("score", "DESC")
    //   .limit(take)
    //   .execute();

    // return highScores;
  }

  public getBotScore(botName: string) {
    return this.repo
      .find({
        where: [{ botName }],
      })
      .then((highScores) => highScores.map((e) => HighscoreDto.fromEntity(e)));
  }

  public async getBestBotScore(botName: string, seasonId: string) {
    return await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where(
        "high_scores.botName = :botName AND high_scores.seasonId = :seasonId",
        {
          botName,
          seasonId,
        },
      )
      .getOne();
  }

  public async updateBestBotScore(
    botName: string,
    seasonId: string,
    score: number,
  ) {
    await this.prisma.highScore.update({
      data: {
        score,
      },
      where: {
        seasonId,
        botName,
      },
    });
    // await this.repo
    //   .createQueryBuilder()
    //   .update(this.entity)
    //   .set({ score })
    //   .where("botName = :botName AND seasonId = :seasonId", {
    //     botName,
    //     seasonId,
    //   })
    //   .execute();
  }

  public async create(dto: HighscoreDto) {
    return this.prisma.highScore.create({
      data: {
        score: dto.score,
        seasonId: dto.seasonId,
        botToken: "",
      },
    });
    // return this.repo.save(dto);
  }

  public async delete(botName: string) {
    return this.prisma.highScore.deleteMany({
      where: {
        bot: {
          name: botName,
        },
      },
    });
    // return await this.repo
    //   .createQueryBuilder()
    //   .delete()
    //   .from(this.entity)
    //   .where("botName = :botName", { botName })
    //   .execute();
  }
}
