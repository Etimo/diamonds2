import { Controller, Get } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
@ApiUseTags("Highscores")
@Controller("api/highscores")
export class HighscoresController {
  @Get()
  get() {}
}
