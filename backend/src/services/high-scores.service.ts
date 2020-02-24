import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { HighscoreDto } from "../models/highscore.dto";
import { promises } from "dns";
import { newExpression } from "@babel/types";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HighScoreEntity } from "../db/models/highScores.entity";

@Injectable()
export class HighScoresService {
  //no db
  private highScores: HighscoreDto[] = [];
  private entityHighScores: string = "highScores";

  constructor(
    @InjectRepository(HighScoreEntity)
    private readonly repo: Repository<HighScoreEntity>,
  ) {
    //with db
    let testHighScore: HighscoreDto = {
      botName: "test2",
      score: 22,
    };

    //with db
    //this.highScores.push(testHighScore);
  }

  public async addOrUpdate(input: HighscoreDto): Promise<boolean> {
    if (await this.isNewHighScore(input)) {
      //this.highScores.push(input);

      await this.create(input);
    }

    return Promise.resolve(true);
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

    const resultSetHighScore = await this.repo
      .createQueryBuilder(this.entityHighScores)
      .where("highScores.botName = :botName", { botName: newScore.botName })
      .getOne();

    if (resultSetHighScore) {
      if (resultSetHighScore.score < newScore.score) {
        //update
        console.log("Update HighScore ");
        await this.repo
          .createQueryBuilder()
          .update("high_scores")
          .set({ score: newScore.score })
          .where("botName = :botName", { botName: newScore.botName })
          .execute();
        isNew = false;
      } else {
        console.log("New HighScore is lower or equal ");
        isNew = false;
      }
    } else {
      console.log("Is new HighScore  ");
    }

    return isNew;
  }
  private isNewHighScoreOnMemory(newScore: HighscoreDto): boolean {
    let isHighScore: boolean = true;

    this.highScores.forEach((highScore, index) => {
      if (newScore.botName == highScore.botName) {
        if (newScore.score > highScore.score) {
          this.updateHighScore(index, newScore);
        }
        isHighScore = false;
        return false;
      }
    });

    return isHighScore;
  }

  private updateHighScore(index: number, newScore: HighscoreDto) {
    this.highScores[index] = newScore;
  }

  public async all() {
    //with db
    return await this.repo
      .find()
      .then(highScores => highScores.map(e => HighscoreDto.fromEntity(e)));

    //with db
    // return this.highScores;
  }
  public async create(dto: HighscoreDto): Promise<HighscoreDto> {
    return this.repo.save(dto);
  }
}
