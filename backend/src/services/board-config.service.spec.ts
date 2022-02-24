import { BoardsService } from "./board.service";
import { Repository, SelectQueryBuilder, Connection } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { HighScoresService } from "./high-scores.service";

import { getRepositoryToken } from "@nestjs/typeorm";
import { CustomLogger } from "../logger";
import { BotsService } from "./bots.service";
import { HighScoreEntity } from "../db/models/highScores.entity";
import UnauthorizedError from "../errors/unauthorized.error";
import { IBot } from "../interfaces/bot.interface";
import NotFoundError from "../errors/not-found.error";
import SilentLogger from "../gameengine/util/silent-logger";
import { MetricsService } from "./metrics.service";
import { SeasonsService } from "./seasons.service";
import { SeasonsEntity } from "../db/models/seasons.entity";
import ConflictError from "../errors/conflict.error";
import { Board } from "../gameengine/board";
import { TeamsService } from "./teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import { BoardConfigService } from "./board-config.service";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { SeasonDto } from "../models/season.dto";
import { BoardConfigDto } from "../models/board-config.dto";
import { HighscoresRepository } from "../db/repositories/highscores.repository";

describe("BoardConfigService", () => {
  let botsService: BotsService;
  let highScoresService: HighScoresService;
  let seasonsService: SeasonsService;
  let boardConfigService: BoardConfigService;
  let repositoryMock: MockType<Repository<HighScoreEntity>>;
  let repositoryMock2: MockType<Repository<BotRegistrationsEntity>>;
  let repositoryMock3: MockType<Repository<SeasonsEntity>>;
  let repositoryMock4: MockType<Repository<BoardConfigEntity>>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HighscoresRepository,
        {
          provide: getRepositoryToken(HighScoreEntity),
          useFactory: jest.fn(),
        },
        BoardConfigService,
        {
          provide: getRepositoryToken(BoardConfigEntity),
          useFactory: repositoryMockFactory,
        },
        BotsService,
        {
          provide: getRepositoryToken(BotRegistrationsEntity),
          useFactory: repositoryMockFactory,
        },
        SeasonsService,
        {
          provide: getRepositoryToken(SeasonsEntity),
          useFactory: repositoryMockFactory,
        },
        HighScoresService,
        {
          provide: getRepositoryToken(HighScoreEntity),
          useFactory: repositoryMockFactory,
        },
        {
          useValue: null,
          provide: MetricsService,
        },
        TeamsService,
        {
          provide: getRepositoryToken(TeamsEntity),
          useFactory: repositoryMockFactory,
        },
        {
          useValue: 2,
          provide: "NUMBER_OF_BOARDS",
        },
      ],
    }).compile();
    highScoresService = module.get<HighScoresService>(HighScoresService);
    botsService = module.get<BotsService>(BotsService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    repositoryMock = module.get(getRepositoryToken(HighScoreEntity));
    repositoryMock2 = module.get(getRepositoryToken(BotRegistrationsEntity));
    repositoryMock3 = module.get(getRepositoryToken(SeasonsEntity));
    repositoryMock4 = module.get(getRepositoryToken(BoardConfigEntity));
    repositoryMock3.createQueryBuilder.mockImplementation(mockGetSeason());
    repositoryMock4.createQueryBuilder.mockImplementation(mockGetBoardConfig());
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(botsService).toBeDefined();
    expect(seasonsService).toBeDefined();
    expect(boardConfigService).toBeDefined();
  });
});

//Repository functions to Mock
// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    update: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(() => ({ getOne: jest.fn(entity => entity) })),
      getOne: jest.fn(),
    })),
    execute: jest.fn(entity => entity),
    where: jest.fn(),
  }),
);
export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

const mockGetSeason = () => {
  let testSeason = {
    id: "321",
    name: "Test Season",
    startDate: new Date(),
    endDate: new Date(),
  };

  const execute = jest.fn();
  const where = jest.fn(() => ({ execute }));
  const set = jest.fn(() => ({ where }));
  const update = jest.fn(() => ({ set }));

  const getOne = jest.fn(
    () =>
      new Promise<SeasonDto>((resolve, reject) => {
        var savedPackage: SeasonDto = testSeason;

        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
  );
  const where2 = jest.fn(() => ({ getOne }));

  return jest.fn(() => ({ where: where2 }));
};

const mockGetBoardConfig = () => {
  let testBoardConfig = {
    id: "321",
    seasonId: "test 1d",
    inventorySize: 5,
    canTackle: false,
    teleporters: 1,
    teleportRelocation: 10,
    height: 15,
    width: 15,
    minimumDelayBetweenMoves: 100,
    sessionLength: 60,
  };

  const execute = jest.fn();
  const where = jest.fn(() => ({ execute }));
  const set = jest.fn(() => ({ where }));
  const update = jest.fn(() => ({ set }));

  const getOne = jest.fn(
    () =>
      new Promise<BoardConfigDto>((resolve, reject) => {
        var savedPackage: BoardConfigDto = testBoardConfig;

        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
  );
  const where2 = jest.fn(() => ({ getOne }));

  return jest.fn(() => ({ where: where2 }));
};
