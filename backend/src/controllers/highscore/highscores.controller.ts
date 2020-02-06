import { Controller, Get, Body, Post } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { HighScoresService } from "src/services/high-scores.service";

@ApiUseTags("Highscores")
@Controller("api/highscores")
export class HighscoresController {
  constructor(private highScoresService: HighScoresService) {}

  @ApiResponse({
    status: 200,
    description: "Returns highscores",
  })
  @Get()
  async listAll() {
    return this.highScoresService.all();
  }
}
