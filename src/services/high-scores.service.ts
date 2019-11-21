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
    let x: HighscoreDto = {
      botName: "Daniel",
      score: 22,
    };

    this.highScores.push(x);
  }

  public async add(input: HighscoreDto): Promise<boolean> {
    this.highScores.push(input);
    return Promise.resolve(true);
  }

  all(): HighscoreDto[] {
    return this.highScores;
  }
}
