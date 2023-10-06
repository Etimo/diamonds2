import { describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import {
  BoardConfigRepository,
  BotRegistrationsRepository,
  HighscoresRepository,
  RecordingsRepository,
  SeasonsRepository,
  TeamsRepository,
} from "../db";
import { SilentLogger } from "../gameengine";
import { CustomLogger } from "../logger";
import { offSeasonId } from "../utils";
import { BoardConfigService } from "./board-config.service";
import { BoardsService } from "./board.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { PrismaService } from "./prisma.service";
import { RecordingsService } from "./recordings.service";
import { SeasonsService } from "./seasons.service";
import { SlackService } from "./slack.service";
import { TeamsService } from "./teams.service";

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
