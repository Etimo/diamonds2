import { Controller, Get, Body, Post, Param } from "@nestjs/common";
import { ApiTags, ApiResponse } from "@nestjs/swagger";
import { HighScoresService } from "src/services/high-scores.service";
import { HighscorePublicDto } from "src/models/highscore-public.dto";

@ApiTags("Highscores")
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
    type: HighscorePublicDto,
  })
  @Get(":seasonId")
  async find(
    @Param("seasonId") seasonId: string,
  ): Promise<HighscorePublicDto[]> {
    return await this.highScoresService.allBySeasonIdPublic(seasonId);
  }
}
