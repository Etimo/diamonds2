import { Module } from "@nestjs/common";
import { IdService } from "./services/id.service";
import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { HighscoresController } from "./controllers/highscore/highscores.controller";
import { BoardsController } from "./controllers/boards/boards.controller";
import { BotsController } from "./controllers/bots/bots.controller";
import { CustomLogger } from "./logger";
import { BoardsService } from "./services/board.service";
import { HighScoresService } from "./services/high-scores.service";

@Module({
  controllers: [BotsController, BoardsController, HighscoresController],
  imports: [],
  providers: [
    CustomLogger,
    BoardsService,
    BotsService,
    IdService,
    ValidatorService,
    HighScoresService,
  ],
})
export class AppModule {}
