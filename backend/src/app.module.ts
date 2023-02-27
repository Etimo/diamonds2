import { Module } from "@nestjs/common";
import { BoardsController } from "./controllers/boards.controller";
import { BotsController } from "./controllers/bots.controller";
import { HighscoresController } from "./controllers/highscores.controller";
import { RecordingsController } from "./controllers/recordings.controller";
import { SeasonsController } from "./controllers/seasons.controller";
import { SlackController } from "./controllers/slack.controller";
import { TeamsController } from "./controllers/teams.controller";
import { HighscoresRepository } from "./db/repositories/highscores.repository";
import { RecordingsRepository } from "./db/repositories/recordings.repository";
import { CustomLogger } from "./logger";
import { AuthorizationService } from "./services/authorization.service";
import { BoardConfigService } from "./services/board-config.service";
import { BoardsService } from "./services/board.service";
import { BotsService } from "./services/bots.service";
import { HighscoresService } from "./services/highscores.service";
import { PrismaService } from "./services/prisma.service";
import { RecordingsService } from "./services/recordings.service";
import { SeasonsService } from "./services/seasons.service";
import { SlackService } from "./services/slack.service";
import { TeamsService } from "./services/teams.service";

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
    AuthorizationService,
    {
      provide: "NUMBER_OF_BOARDS",
      useValue: 4,
    },
  ],
})
export class AppModule {}
