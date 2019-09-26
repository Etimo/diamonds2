import { Module } from "@nestjs/common";
import { IdService } from "./services/id-service.service";
import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { HighscoresController } from "./controllers/highscore/highscores.controller";
import { BoardsController } from "./controllers/boards/boards.controller";
import { BotsController } from "./controllers/bots/bots.controller";
import { CustomLogger } from "./logger";

@Module({
  controllers: [BotsController, BoardsController, HighscoresController],
  imports: [],
  providers: [CustomLogger, BotsService, IdService, ValidatorService],
})
export class AppModule {}
