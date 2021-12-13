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
import { createMock } from "@golevelup/ts-jest";
import { Repository } from "typeorm";
import { BoardConfigRepository } from "./db/repositories/board-config.repository";
import { BotsRepository } from "./db/repositories/bots.repository";
import { TeamsRepository } from "./db/repositories/teams.repository";

export const createTestingModule = async (): Promise<TestingModule> => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      BoardConfigService,
      BoardConfigRepository,
      BoardsService,
      BotsService,
      BotsRepository,
      HighscoresRepository,
      HighScoresService,
      RecordingsRepository,
      RecordingsService,
      SeasonsService,
      SeasonsRepository,
      SlackService,
      TeamsService,
      TeamsRepository,
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      {
        provide: getRepositoryToken(HighScoreEntity),
        useValue: createMock<Repository<HighScoreEntity>>(),
      },
      {
        provide: getRepositoryToken(BotRegistrationsEntity),
        useValue: createMock<Repository<BotRegistrationsEntity>>(),
      },
      {
        provide: getRepositoryToken(RecordingsEntity),
        useValue: createMock<Repository<RecordingsEntity>>(),
      },
      {
        provide: getRepositoryToken(SeasonsEntity),
        useValue: createMock<Repository<SeasonsEntity>>(),
      },
      {
        provide: getRepositoryToken(HighScoreEntity),
        useValue: createMock<Repository<HighScoreEntity>>(),
      },
      {
        provide: getRepositoryToken(TeamsEntity),
        useValue: createMock<Repository<TeamsEntity>>(),
      },
      {
        provide: getRepositoryToken(BoardConfigEntity),
        useValue: createMock<Repository<BoardConfigEntity>>(),
      },
      {
        useValue: 4,
        provide: "NUMBER_OF_BOARDS",
      },
    ],
  }).compile();
  return module;
};
