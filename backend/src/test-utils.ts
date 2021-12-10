import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BoardConfigEntity } from "./db/models/boardConfig.entity";
import { BotRegistrationsEntity } from "./db/models/botRegistrations.entity";
import { HighScoreEntity } from "./db/models/highScores.entity";
import { RecordingsEntity } from "./db/models/recordings.entity";
import { SeasonsEntity } from "./db/models/seasons.entity";
import { TeamsEntity } from "./db/models/teams.entity";
import { HighscoresRepository } from "./db/repositories/highscores.repository";
import { RecordingsRepository } from "./db/repositories/recordings.repository";
import { SeasonsRepository } from "./db/repositories/seasons.repository";
import SilentLogger from "./gameengine/util/silent-logger";
import { CustomLogger } from "./logger";
import { BoardConfigService } from "./services/board-config.service";
import { BoardsService } from "./services/board.service";
import { BotsService } from "./services/bots.service";
import { HighScoresService } from "./services/high-scores.service";
import { RecordingsService } from "./services/recordings.service";
import { SeasonsService } from "./services/seasons.service";
import { SlackService } from "./services/slack.service";
import { TeamsService } from "./services/teams.service";

export const createTestingModule = async (): Promise<TestingModule> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BoardConfigService,
      BoardsService,
      BotsService,
      HighscoresRepository,
      HighScoresService,
      RecordingsRepository,
      RecordingsService,
      SeasonsService,
      SeasonsRepository,
      SlackService,
      TeamsService,
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      {
        provide: getRepositoryToken(HighScoreEntity),
        useFactory: jest.fn(),
      },
      {
        provide: getRepositoryToken(BotRegistrationsEntity),
        useFactory: () => jest.fn(),
      },
      {
        provide: getRepositoryToken(RecordingsEntity),
        useFactory: () => jest.fn(),
      },
      {
        provide: getRepositoryToken(SeasonsEntity),
        useFactory: () => jest.fn(),
      },
      {
        provide: getRepositoryToken(HighScoreEntity),
        useFactory: () => jest.fn(),
      },
      {
        provide: getRepositoryToken(TeamsEntity),
        useFactory: () => jest.fn(),
      },
      {
        provide: getRepositoryToken(BoardConfigEntity),
        useFactory: () => jest.fn(),
      },
      {
        useValue: 2,
        provide: "NUMBER_OF_BOARDS",
      },
    ],
  }).compile();
  return module;
};
