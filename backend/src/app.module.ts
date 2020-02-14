import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { IdService } from "./services/id.service";
import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { HighscoresController } from "./controllers/highscore/highscores.controller";
import { BoardsController } from "./controllers/boards/boards.controller";
import { BotsController } from "./controllers/bots/bots.controller";
import { CustomLogger } from "./logger";
import { BoardsService } from "./services/board.service";
import { HighScoresService } from "./services/high-scores.service";
import { configService } from "./config/config.service";

@Module({
  controllers: [BotsController, BoardsController, HighscoresController],
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env["DIAMONDS_ORM_HOST"],
      port: parseInt(process.env["DIAMONDS_ORM_PORT"]),
      username: process.env["DIAMONDS_ORM_USERNAME"],
      password: process.env["DIAMONDS_ORM_PASSWORD"],
      database: process.env["DIAMONDS_ORM_DATABASE"],
      synchronize: false,
    }),
  ],
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
