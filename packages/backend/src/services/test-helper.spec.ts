import { describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import {
  BoardConfigRepository,
  BotRegistrationsRepository,
  HighscoresRepository,
  RecordingsRepository,
  SeasonsRepository,
  TeamsRepository,
} from "../db/index.ts";
import { SilentLogger } from "../gameengine/index.ts";
import { CustomLogger } from "../logger.ts";
import { offSeasonId } from "../utils/index.ts";
import { BoardConfigService } from "./board-config.service.ts";
import { BoardsService } from "./board.service.ts";
import { BotsService } from "./bots.service.ts";
import { HighscoresService } from "./highscores.service.ts";
import { PrismaService } from "./prisma.service.ts";
import { RecordingsService } from "./recordings.service.ts";
import { SeasonsService } from "./seasons.service.ts";
import { SlackService } from "./slack.service.ts";
import { TeamsService } from "./teams.service.ts";

// Mocked data
export const boardConfigTest = {
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

export const offSeasonTest = {
  id: offSeasonId,
  name: "Off Season",
  startDate: new Date(),
  endDate: new Date(),
};

// Mocked repositories
export const seasonsRepositoryMock = {
  getById: jest.fn(),
  getAll: jest.fn(),
  getCurrentSeason: jest.fn(),
  create: jest.fn(),
  dateCollision: jest.fn(),
  getByName: jest.fn(),
};

export const teamsRepositoryMock = {
  get: jest.fn(),
  create: jest.fn(),
  getByAbbreviation: jest.fn(),
};

export const highscoresRepositoryMock = {
  create: jest.fn(),
  allBySeasonIdRaw: jest.fn(),
  getBestBotScore: jest.fn(),
  getBotScore: jest.fn(),
  updateBestBotScore: jest.fn(),
};

export const boardConfigRepositoryMock = {
  create: jest.fn(),
  getBoardConfigById: jest.fn(),
};

export const recordingsRepositoryMock = {
  getById: jest.fn(),
  allBySeasonIdRaw: jest.fn(),
  create: jest.fn(),
  getScores: jest.fn(),
  deleteRecordingsWithLowScore: jest.fn(),
};

export const botRepositryMock = {
  getByEmail: jest.fn(),
  getByName: jest.fn(),
  create: jest.fn(),
  get: jest.fn(),
};

// Test module
export async function createTestModule() {
  const numberOfBoards = 1;
  const maxNumberOfBoards = 10;

  seasonsRepositoryMock.getCurrentSeason.mockReturnValueOnce(offSeasonTest);
  boardConfigRepositoryMock.getBoardConfigById.mockReturnValueOnce(
    boardConfigTest,
  );

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      SlackService,
      {
        provide: SeasonsService,
        useClass: SeasonsService,
      },
      {
        provide: TeamsService,
        useClass: TeamsService,
      },
      {
        provide: HighscoresService,
        useClass: HighscoresService,
      },
      {
        provide: BoardConfigService,
        useClass: BoardConfigService,
      },
      BoardsService,
      {
        provide: BotsService,
        useClass: BotsService,
      },
      {
        provide: SeasonsService,
        useClass: SeasonsService,
      },
      {
        provide: BoardConfigService,
        useClass: BoardConfigService,
      },
      {
        provide: RecordingsService,
        useClass: RecordingsService,
      },
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      {
        provide: "NUMBER_OF_BOARDS",
        useValue: numberOfBoards,
      },
      {
        provide: "MAX_EPHEMERAL_BOARDS",
        useValue: maxNumberOfBoards,
      },
      BotsService,
      {
        provide: TeamsService,
        useClass: TeamsService,
      },
      {
        provide: BotRegistrationsRepository,
        useValue: botRepositryMock,
      },
      {
        provide: PrismaService,
        useClass: PrismaService,
      },

      RecordingsService,
      {
        provide: RecordingsRepository,
        useClass: RecordingsRepository,
      },
      {
        provide: CustomLogger,
        useValue: new SilentLogger() as CustomLogger,
      },
      HighscoresService,
      {
        provide: SeasonsService,
        useClass: SeasonsService,
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
        useClass: SeasonsService,
      },
      {
        provide: BoardConfigRepository,
        useValue: boardConfigRepositoryMock,
      },
      SeasonsService,
      {
        provide: SeasonsRepository,
        useValue: seasonsRepositoryMock,
      },
    ],
  }).compile();
  return module;
}

describe("Test helper", () => {
  it("should create a test module", async () => {
    const module = await createTestModule();
    expect(module).toBeDefined();
  });
});
