import { Module } from "@nestjs/common";
import { BoardsService } from "./services/boards.service";
import { IdService } from "./services/id-service.service";
import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { ExpiredBotsController } from "./controllers/v1/expired-bots/expired-bots.controller";
import { HighscoreController } from "./controllers/v1/highscore/highscore.controller";
import { BoardsController } from "./controllers/v1/boards/boards.controller";
import { BotsController } from "./controllers/v1/bots/bots.controller";

@Module({
  controllers: [
    BotsController,
    BoardsController,
    HighscoreController,
    ExpiredBotsController,
  ],
  imports: [],
  providers: [BoardsService, BotsService, IdService, ValidatorService],
})
export class AppModule {}
