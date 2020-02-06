import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { IdService } from "./id.service";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { HighscoreDto } from "src/models/highscore.dto";
import { promises } from "dns";
import { newExpression } from "@babel/types";

@Injectable()
export class HighScoresService {
  private highScores: HighscoreDto[] = [];

  constructor(private readonly idService: IdService) {
    let testHighScore: HighscoreDto = {
      botName: "test",
      score: 22,
    };

    this.highScores.push(testHighScore);
  }

  public async addOrUpdate(input: HighscoreDto): Promise<boolean> {
    if (this.isNewHighScore(input)) {
      this.highScores.push(input);
    }
    return Promise.resolve(true);
  }

  private isNewHighScore(newScore: HighscoreDto): boolean {
    let isHighScore: boolean = true;

    this.highScores.forEach((highScore, index) => {
      // console.log(
      //   " botName: " + highScore.botName + " score = " + highScore.score,
      // );
      if (newScore.botName == highScore.botName) {
        if (newScore.score > highScore.score) {
          this.updateHighScore(index, newScore);
        }
        isHighScore = false;
        return false;
      }
    });
    // console.log(
    //   " botName: " + newScore.botName + " isHighScore = " + isHighScore,
    // );
    return isHighScore;
  }

  private updateHighScore(index: number, newScore: HighscoreDto) {
    this.highScores[index] = newScore;
  }

  all(): HighscoreDto[] {
    return this.highScores;
  }
}
