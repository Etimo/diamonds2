import { Controller, Get, Body, Post, Param } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { HighScoresService } from "src/services/high-scores.service";
import { HighscoreDto } from "src/models/highscore.dto";

@ApiUseTags("Highscores")
@Controller("api/highscores")
export class HighscoresController {
  constructor(private highScoresService: HighScoresService) {}

  /**
   * Returns all highscores on a specific season.
   *
   * @param season The name of the season.
   */
  @ApiResponse({
    status: 200,
    description: "Returns highscores by season",
    isArray: true,
    type: HighscoreDto,
  })
  @Get(":seasonId")
  async find(@Param("seasonId") seasonId: string): Promise<HighscoreDto[]> {
    return await this.highScoresService.allBySeasonId(seasonId);
  }
}
