import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";

import { ValidatorService } from "./services/validator.service";
import { BotsService } from "./services/bots.service";
import { HighscoresController } from "./controllers/highscore/highscores.controller";
import { BoardsController } from "./controllers/boards/boards.controller";
import { BotsController } from "./controllers/bots/bots.controller";
import { SeasonsController } from "./controllers/seasons/seasons.controller";
import { SlackController } from "./controllers/slack/slack.controller";
import { TeamsController } from "./controllers/teams/teams.controller";
import { CustomLogger } from "./logger";
import { BoardsService } from "./services/board.service";
import { HighScoresService } from "./services/high-scores.service";
import { SeasonsService } from "./services/seasons.service";
import { AuthorizationService } from "./services/authorization.service";

import { HighScoreEntity } from "./db/models/highScores.entity";
import { BotRegistrationsEntity } from "./db/models/botRegistrations.entity";
import { SeasonsEntity } from "./db/models/seasons.entity";
import { TeamsEntity } from "./db/models/teams.entity";
import { MetricsService } from "./services/metrics.service";
import { AutoScaleMiddleware } from "./middlewares/auto-scale-boards.middleware";
import { SlackService } from "./services/slack.service";
import { TeamsService } from "./services/teams.service";
import { RecordingsService } from "./services/recordings.service";
import { RecordingsEntity } from "./db/models/recordings.entity";
import { RecordingsController } from "./controllers/recordings/recordings.controller";
import { RecordingsRepository } from "./db/repositories/recordings.repository";
import { BoardConfigService } from "./services/board-config.service";
import { BoardConfigEntity } from "./db/models/boardConfig.entity";
import { HighscoresRepository } from "./db/repositories/highscores.repository";

const dbConfig: TypeOrmModuleOptions = {
  type: "postgres",
  host: process.env["TYPEORM_HOST"],
  port: parseInt(process.env["TYPEORM_PORT"]),
  username: process.env["TYPEORM_USERNAME"],
  password: process.env["TYPEORM_PASSWORD"],
  database: process.env["TYPEORM_DATABASE"],
  synchronize: process.env["ENVIRONMENT"] === "development",
  entities: [
    HighScoreEntity,
    BotRegistrationsEntity,
    SeasonsEntity,
    TeamsEntity,
    RecordingsEntity,
    BoardConfigEntity,
  ],
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
    TeamsController,
    RecordingsController,
  ],
  imports: [
    TypeOrmModule.forRoot(dbConfig),

    TypeOrmModule.forFeature([
      HighScoreEntity,
      BotRegistrationsEntity,
      SeasonsEntity,
      TeamsEntity,
      RecordingsEntity,
      BoardConfigEntity,
    ]),
  ],
  providers: [
    CustomLogger,
    BoardsService,
    BotsService,
    ValidatorService,
    HighScoresService,
    MetricsService,
    SeasonsService,
    SlackService,
    AuthorizationService,
    TeamsService,
    RecordingsService,
    RecordingsRepository,
    HighscoresRepository,
    BoardConfigService,
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
