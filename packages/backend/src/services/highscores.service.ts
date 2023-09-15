import { Injectable } from "@nestjs/common";
import { HighscoresRepository } from "../db";
import { HighscorePrivateDto } from "../models";
import { IHighscore, INewHighscore } from "../types";
import { SeasonsService } from "./seasons.service";

@Injectable()
export class HighscoresService {
  constructor(
    private seasonsService: SeasonsService,
    private repo: HighscoresRepository,
  ) {}

  public async addOrUpdate(input: INewHighscore): Promise<boolean> {
    const seasonAllTimeBest = await this.getSeasonBestHighScore(input.seasonId);

    if (await this.isNewHighScore(input)) {
      await this.create(input);
    }

    return seasonAllTimeBest < input.score;
  }

  public async getBotScore(newScore: IHighscore) {
    return this.repo.getBotScore(newScore.botId);
  }

  private async isNewHighScore(newScore: INewHighscore) {
    let isNew: boolean = true;
    const season = await this.seasonsService.getCurrentSeason();

    const resultSetHighScore = await this.repo.getBestBotScore(
      newScore.botId,
      newScore.seasonId,
    );

    if (resultSetHighScore) {
      if (resultSetHighScore.score < newScore.score) {
        await this.repo.updateBestBotScore(
          newScore.botId,
          newScore.seasonId,
          newScore.score,
        );
        isNew = false;
      } else {
        isNew = false;
      }
    }

    return isNew;
  }

  private async getSeasonBestHighScore(seasonId: string): Promise<number> {
    const existingBest = await this.allBySeasonId(seasonId, 1);
    if (existingBest.length === 0) {
      return 0;
    }
    return existingBest[0].score;
  }

  private async allBySeasonId(seasonId: string, limit: number = 0) {
    const currentSeason = await this.seasonsService.getCurrentSeason();
    return this.repo.allBySeasonIdRaw(seasonId, currentSeason.id);
  }

  public async allBySeasonIdPrivate(
    seasonId: string,
    limit: number = 0,
  ): Promise<HighscorePrivateDto[]> {
    const highScores = await this.allBySeasonId(seasonId, limit);
    return highScores.map((e) => ({
      botName: e.bot!.name,
      email: e.bot!.email,
      score: e.score,
    }));
  }

  public async allBySeasonIdPublic(seasonId: string) {
    return this.allBySeasonId(seasonId);
  }

  public async create(data: INewHighscore) {
    return this.repo.create(data);
  }

  public async deleteFor(botId: string) {
    return this.repo.delete(botId);
  }
}
