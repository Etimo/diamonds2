import { Test, TestingModule } from "@nestjs/testing";
import { BoardConfigRepository } from "../db/repositories/boardConfig.repository";
import { BotRegistrationsRepository } from "../db/repositories/botRegistrations.repository";
import { HighscoresRepository } from "../db/repositories/highscores.repository";
import { RecordingsRepository } from "../db/repositories/recordings.repository";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import { TeamsRepository } from "../db/repositories/teams.repository";
import SilentLogger from "../gameengine/util/silent-logger";
import { CustomLogger } from "../logger";
import { offSeasonId } from "../utils/slack/utils";
import { BoardConfigService } from "./board-config.service";
import { BoardsService } from "./board.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { RecordingsService } from "./recordings.service";
import { SeasonsService } from "./seasons.service";
import { SlackService } from "./slack.service";
import { TeamsService } from "./teams.service";

// Mocked data
export let boardConfigTest = {
  id: "test",
  seasonId: "321",
  inventorySize: 5,
  canTackle: false,
  teleporters: 1,
  teleportRelocation: 10,
  height: 15,
  width: 15,
  minimumDelayBetweenMoves: 100,
  sessionLength: 60,
};

export let offSeasonTest = {
  id: offSeasonId,
  name: "Off Season",
  startDate: new Date(),
  endDate: new Date(),
};

// Mocked repositories
export let seasonsRepositoryMock = {
  getById: jest.fn(),
  getAll: jest.fn(),
  getCurrentSeason: jest.fn(),
  create: jest.fn(),
  dateCollision: jest.fn(),
  getByName: jest.fn(),
};

export let teamsRepositoryMock = {
  get: jest.fn(),
  create: jest.fn(),
  getByAbbreviation: jest.fn(),
};

export let highscoresRepositoryMock = {
  create: jest.fn(),
  allBySeasonIdRaw: jest.fn(),
  getBestBotScore: jest.fn(),
  getBotScore: jest.fn(),
  updateBestBotScore: jest.fn(),
};

export let boardConfigRepositoryMock = {
  create: jest.fn(),
  getBoardConfigById: jest.fn(),
};

export let recordingsRepositoryMock = {
  getById: jest.fn(),
  allBySeasonIdRaw: jest.fn(),
  create: jest.fn(),
  purgeOld: jest.fn(),
};

export let botRepositryMock = {
  getByEmail: jest.fn(),
  getByName: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
};

// Test module
export async function GetTestModule() {
  const numberOfBoards = 4;

  let slackService: SlackService;
  let botsService: BotsService;
  let seasonsService: SeasonsService;
  let teamsService: TeamsService;
  let highScoresService: HighscoresService;
  let boardConfigService: BoardConfigService;
  let recordingsService: RecordingsService;

  seasonsRepositoryMock.getCurrentSeason.mockReturnValueOnce(offSeasonTest);
  boardConfigRepositoryMock.getBoardConfigById.mockReturnValueOnce(
    boardConfigTest,
  );

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SlackService,
      {
        provide: SeasonsService,
        useValue: seasonsService,
      },
      {
        provide: TeamsService,
        useValue: teamsService,
      },
      {
        provide: HighscoresService,
        useValue: highScoresService,
      },
      {
        provide: BoardConfigService,
        useValue: boardConfigService,
      },
      BoardsService,
      {
        provide: BotsService,
        useValue: botsService,
      },
      {
        provide: SeasonsService,
        useValue: seasonsService,
      },
      {
        provide: BoardConfigService,
        useValue: boardConfigService,
      },
      {
        provide: RecordingsService,
        useValue: recordingsService,
      },
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      BotsService,
      {
        provide: TeamsService,
        useValue: teamsService,
      },
      {
        provide: BotRegistrationsRepository,
        useValue: botRepositryMock,
      },
      SeasonsService,
      {
        provide: SeasonsRepository,
        useValue: seasonsRepositoryMock,
      },
      RecordingsService,
      {
        provide: RecordingsRepository,
        useValue: recordingsRepositoryMock,
      },
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      HighscoresService,
      {
        provide: SeasonsService,
        useValue: seasonsService,
      },
      {
        provide: HighscoresRepository,
        useValue: highscoresRepositoryMock,
      },
      TeamsService,
      {
        provide: TeamsRepository,
        useValue: teamsRepositoryMock,
      },
      BoardConfigService,
      {
        provide: SeasonsService,
        useValue: seasonsService,
      },
      {
        provide: BoardConfigRepository,
        useValue: boardConfigRepositoryMock,
      },
      {
        useValue: numberOfBoards,
        provide: "NUMBER_OF_BOARDS",
      },
    ],
  }).compile();
  return module;
}
