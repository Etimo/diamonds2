import { Injectable } from "@nestjs/common";
import { HighscoreDto } from "../models/highscore.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { MetricsService } from "./metrics.service";
import { SeasonsService } from "./seasons.service";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { TeamsEntity } from "../db/models/teams.entity";
import { HighscorePublicDto } from "../models/highscore-public.dto";
import { HighscorePrivateDto } from "../models/highscore-private.dto";

@Injectable()
export class HighScoresService {
  //no db
  private highScores: HighscoreDto[] = [];
  private entityHighScores: string = "highScores";

  constructor(
    @InjectRepository(HighScoreEntity)
    private readonly repo: Repository<HighScoreEntity>,
    private metricsService: MetricsService,
    private seasonService: SeasonsService,
  ) {}

  public async addOrUpdate(input: HighscoreDto): Promise<boolean> {
    const seasonAllTimeBest = await this.getSeasonBestHighScore(input.seasonId);

    if (await this.isNewHighScore(input)) {
      await this.create(input);
      if (this.metricsService) {
        this.metricsService.incHighscoresImproved();
      }
    }

    return seasonAllTimeBest < input.score;
  }

  public async getBotScore(newScore: HighscoreDto) {
    return this.repo
      .find({
        where: [{ botName: newScore.botName }],
      })
      .then(highScores => highScores.map(e => HighscoreDto.fromEntity(e)));
  }

  private async isNewHighScore(newScore: HighscoreDto) {
    let isNew: boolean = true;
    const season = await this.seasonService.getCurrentSeason();

    const resultSetHighScore = await this.repo
      .createQueryBuilder(this.entityHighScores)
      .where(
        "highScores.botName = :botName AND highScores.seasonId = :seasonId",
        {
          botName: newScore.botName,
          seasonId: season.id,
        },
      )
      .getOne();

    if (resultSetHighScore) {
      if (resultSetHighScore.score < newScore.score) {
        await this.repo
          .createQueryBuilder()
          .update("high_scores")
          .set({ score: newScore.score })
          .where("botName = :botName AND seasonId = :seasonId", {
            botName: newScore.botName,
            seasonId: season.id,
          })
          .execute();
        isNew = false;
        if (this.metricsService) {
          this.metricsService.incHighscoresImproved();
        }
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
    return existingBest[0]["highScores_score"];
  }

  private async allBySeasonIdRaw(seasonId: string, limit: number = 0) {
    const currentSeason = await this.seasonService.getCurrentSeason();
    const take = limit ? limit : seasonId === currentSeason.id ? 50 : 20;
    // Using joins to fetch logotypeUrl that related to the bots team.
    const highScores = await this.repo
      .createQueryBuilder(this.entityHighScores)
      .select(this.entityHighScores)
      .where("highScores.seasonId = :seasonId", { seasonId: seasonId })
      .leftJoinAndSelect(
        BotRegistrationsEntity,
        "bot",
        "highScores.botName = bot.botName",
      )
      .leftJoinAndSelect(TeamsEntity, "teams", "bot.team = teams.id")
      .orderBy("score", "DESC")
      .limit(take)
      .execute();

    return highScores;
  }

  public async allBySeasonIdPrivate(seasonId: string, limit: number = 0) {
    const highScores = await this.allBySeasonIdRaw(seasonId, limit);
    return highScores.map(e => HighscorePrivateDto.fromRawDataObject(e));
  }

  public async allBySeasonIdPublic(seasonId: string) {
    const highScores = await this.allBySeasonIdRaw(seasonId);
    return highScores.map(e => HighscorePublicDto.fromRawDataObject(e));
  }

  public async create(dto: HighscoreDto): Promise<HighscoreDto> {
    return this.repo.save(dto);
  }

  public async delete(dto: HighscoreDto) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .from("high_scores")
      .where("botName = :botName", { botName: dto.botName })
      .execute();
  }
}
