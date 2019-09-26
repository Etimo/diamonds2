import { Controller, Get } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
@ApiUseTags("Highscore")
@Controller("api/highscore")
export class HighscoreController {
  @Get()
  get() {}
}
