import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HighScoreEntity } from "../models/highScores.entity";
import { BotRegistrationsEntity } from "../models/botRegistrations.entity";
import { TeamsEntity } from "../models/teams.entity";
import { HighscoreDto } from "../../models/highscore.dto";

@Injectable()
export class HighscoresRepository {
  private entity: string = "high_scores";

  constructor(
    @InjectRepository(HighScoreEntity)
    private readonly repo: Repository<HighScoreEntity>,
  ) {}

  public async allBySeasonIdRaw(
    seasonId: string,
    currentSeasonId: string,
    limit: number = 0,
  ) {
    const take = limit ? limit : seasonId === currentSeasonId ? 50 : 20;
    // Using joins to fetch logotypeUrl that related to the bots team.
    const highScores = await this.repo
      .createQueryBuilder(this.entity)
      .select(this.entity)
      .where("highScores.seasonId = :seasonId", { seasonId: seasonId })
      .leftJoinAndSelect(
        BotRegistrationsEntity,
        "bot",
        "high_scores.botName = bot.botName",
      )
      .leftJoinAndSelect(TeamsEntity, "teams", "bot.team = teams.id")
      .orderBy("score", "DESC")
      .limit(take)
      .execute();

    return highScores;
  }

  public getBotScore(botName: string) {
    return this.repo
      .find({
        where: [{ botName }],
      })
      .then(highScores => highScores.map(e => HighscoreDto.fromEntity(e)));
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
    await this.repo
      .createQueryBuilder()
      .update(this.entity)
      .set({ score })
      .where("botName = :botName AND seasonId = :seasonId", {
        botName,
        seasonId,
      })
      .execute();
  }

  public async create(dto: HighscoreDto): Promise<HighscoreDto> {
    return this.repo.save(dto);
  }

  public async delete(botName: string) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .from(this.entity)
      .where("botName = :botName", { botName })
      .execute();
  }
}
