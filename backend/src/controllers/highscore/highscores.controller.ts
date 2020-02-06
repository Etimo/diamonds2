import { Controller, Get, Body, Post } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { HighscoreDto } from "src/models/highscore.dto";
import { HighScoresService } from "src/services/high-scores.service";
@ApiUseTags("Highscores")
@Controller("api/highscores")
export class HighscoresController {
  constructor(private highScoresService: HighScoresService) {}

  @Get()
  async listAll() {
    return this.highScoresService.all();
  }
}
