import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { IdService } from "./services/id.service";
import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { HighscoresController } from "./controllers/highscore/highscores.controller";
import { BoardsController } from "./controllers/boards/boards.controller";
import { BotsController } from "./controllers/bots/bots.controller";
import { SeasonsController } from "./controllers/seasons/seasons.controller";
import { SlackController } from "./controllers/slack/slack.controller";
import { CustomLogger } from "./logger";
import { BoardsService } from "./services/board.service";
import { HighScoresService } from "./services/high-scores.service";
import { SeasonsService } from "./services/seasons.service";
import { AuthorizationService } from "./services/authorization.service";

import { HighScoreEntity } from "./db/models/highScores.entity";
import { BotRegistrationsEntity } from "./db/models/botRegistrations.entity";
import { SeasonsEntity } from "./db/models/seasons.entity";
import { MetricsService } from "./services/metrics.service";
import { AutoScaleMiddleware } from "./middlewares/auto-scale-boards.middleware";
import { SlackService } from "./services/slack.service";

const dbConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env["TYPEORM_HOST"],
  port: parseInt(process.env["TYPEORM_PORT"]),
  username: process.env["TYPEORM_USERNAME"],
  password: process.env["TYPEORM_PASSWORD"],
  database: process.env["TYPEORM_DATABASE"],
  synchronize: process.env["ENVIRONMENT"] === "development",
  entities: [HighScoreEntity, BotRegistrationsEntity, SeasonsEntity],
  migrationsTableName: "migration",
  migrations: ["./migration/*.{ts,js}"],
  ssl: false,
};
console.log("DB Config", dbConfig.host, dbConfig.username);
@Module({
  controllers: [
    BotsController,
    BoardsController,
    HighscoresController,
    SeasonsController,
    SlackController,
  ],
  imports: [
    TypeOrmModule.forRoot(dbConfig),

    TypeOrmModule.forFeature([
      HighScoreEntity,
      BotRegistrationsEntity,
      SeasonsEntity,
    ]),
  ],
  providers: [
    CustomLogger,
    BoardsService,
    BotsService,
    IdService,
    ValidatorService,
    HighScoresService,
    MetricsService,
    SeasonsService,
    SlackService,
    AuthorizationService,
    {
      provide: "NUMBER_OF_BOARDS",
      useValue: 4,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AutoScaleMiddleware).forRoutes("*/move");
  }
}
