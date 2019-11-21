import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { IdService } from "./id.service";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { HighscoreDto } from "src/models/highscore.dto";
import { promises } from "dns";

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

  public async add(input: HighscoreDto): Promise<boolean> {
    if (this.isHighScore(input)) {
      this.highScores.push(input);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  private isHighScore(newScore: HighscoreDto): boolean {
    let isHighScore: boolean = true;

    this.highScores.forEach(highScore => {
      if (newScore.botName == highScore.botName) {
        isHighScore = newScore.score > highScore.score;
        return false;
      }
    });
    console.log("highScore=" + isHighScore + " botName" + newScore.botName);
    return isHighScore;
  }

  all(): HighscoreDto[] {
    return this.highScores;
  }
}
