import { Controller, Get } from "@nestjs/common";
import { ApiUseTags, ApiResponse } from "@nestjs/swagger";
import { HighscoreDto } from "src/models/v1/highscore.dto";
@ApiUseTags("Highscores")
@Controller("api/Highscores")
export class HighscoresController {
  @ApiResponse({
    status: 200,
    description: "Returns highscores",
    type: HighscoreDto,
    isArray: true,
  })
  @Get()
  async get(): Promise<HighscoreDto[]> {
    return;
  }
}
