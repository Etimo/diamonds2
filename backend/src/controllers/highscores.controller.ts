import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { HighscorePublicDto } from "src/models/highscore-public.dto";
import { HighscoresService } from "src/services/highscores.service";

@ApiTags("Highscores")
@Controller("api/highscores")
export class HighscoresController {
  constructor(private highscoresService: HighscoresService) {}

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
    return this.highscoresService.allBySeasonIdPublic(seasonId);
  }
}
