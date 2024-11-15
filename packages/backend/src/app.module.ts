import { Module } from "@nestjs/common";
import {
  BoardsController,
  BotsController,
  HighscoresController,
  RecordingsController,
  SeasonsController,
  SlackController,
  TeamsController,
} from "./controllers/index.ts";
import {
  BoardConfigRepository,
  BotRegistrationsRepository,
  HighscoresRepository,
  RecordingsRepository,
  SeasonsRepository,
  TeamsRepository,
} from "./db/index.ts";
import { CustomLogger } from "./logger.ts";
import {
  AuthorizationService,
  BoardConfigService,
  BoardsService,
  BotsService,
  HighscoresService,
  PrismaService,
  RecordingsService,
  SeasonsService,
  SlackService,
  TeamsService,
} from "./services/index.ts";

@Module({
  controllers: [
    BoardsController,
    BotsController,
    HighscoresController,
    RecordingsController,
    SeasonsController,
    SlackController,
    TeamsController,
  ],
  providers: [
    PrismaService,
    BoardsService,
    HighscoresService,
    BotsService,
    RecordingsService,
    SeasonsService,
    SlackService,
    TeamsService,
    BoardConfigService,
    CustomLogger,
    HighscoresRepository,
    RecordingsRepository,
    SeasonsRepository,
    TeamsRepository,
    BoardConfigRepository,
    BotRegistrationsRepository,
    AuthorizationService,
    {
      provide: "NUMBER_OF_BOARDS",
      useValue: 1,
    },
    {
      provide: "MAX_EPHEMERAL_BOARDS",
      useValue: 9,
    },
  ],
})
export class AppModule {}
