import { BoardsService } from "./board.service";
import { Repository } from "typeorm";
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
import { TeamsService } from "./teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import { RecordingsService } from "./recordings.service";
import { RecordingsEntity } from "../db/models/recordings.entity";
import { BoardConfigService } from "./board-config.service";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { BoardConfigDto } from "src/models/board-config.dto";
import { RecordingsRepository } from "../db/repositories/recordings.repository";
import { HighscoresRepository } from "../db/repositories/highscores.repository";

describe("BoardsService", () => {
  let botsService: BotsService;
  let highScoresService: HighScoresService;
  let seasonsService: SeasonsService;
  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";
  const dummyBotId = "dummyId";
  let boardsService: BoardsService;
  let boardConfigService: BoardConfigService;
  let newBoardsService: BoardsService;
  let recordingsService: RecordingsService;
  let repositoryMock: MockType<Repository<HighScoreEntity>>;
  let repositoryMock2: MockType<Repository<BotRegistrationsEntity>>;
  let repositoryMock3: MockType<Repository<SeasonsEntity>>;
  let repositoryMock4: MockType<Repository<BoardConfigEntity>>;
  const boardConfig = {
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
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: CustomLogger,
          useValue: new SilentLogger() as CustomLogger,
        },
        HighscoresRepository,
        {
          provide: getRepositoryToken(HighScoreEntity),
          useFactory: jest.fn(),
        },
        BotsService,
        {
          provide: getRepositoryToken(BotRegistrationsEntity),
          useFactory: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(RecordingsEntity),
          useFactory: repositoryMockFactory,
        },
        SeasonsService,
        RecordingsRepository,
        RecordingsService,
        {
          provide: getRepositoryToken(RecordingsEntity),
          useFactory: () => jest.fn(),
        },
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
        BoardConfigService,
        {
          provide: getRepositoryToken(BoardConfigEntity),
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
    recordingsService = module.get<RecordingsService>(RecordingsService);
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    repositoryMock = module.get(getRepositoryToken(HighScoreEntity));
    repositoryMock2 = module.get(getRepositoryToken(BotRegistrationsEntity));
    repositoryMock3 = module.get(getRepositoryToken(SeasonsEntity));
    repositoryMock4 = module.get(getRepositoryToken(BoardConfigEntity));
    spyOn(boardConfigService, "getCurrentBoardConfig").and.returnValue(
      boardConfig as BoardConfigDto,
    );
    boardsService = new BoardsService(
      botsService,
      highScoresService,
      null,
      seasonsService,
      recordingsService,
      boardConfigService,
      new SilentLogger() as CustomLogger,
      2,
    );

    newBoardsService = new BoardsService(
      botsService,
      highScoresService,
      null,
      seasonsService,
      recordingsService,
      boardConfigService,
      new SilentLogger() as CustomLogger,
      5,
    );

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(botsService).toBeDefined();
    expect(boardsService).toBeDefined();
    expect(seasonsService).toBeDefined();
  });

  it("Should throw UnauthorizedError when bot not exists", async () => {
    spyOn(botsService, "get").and.returnValue(undefined);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("Should throw ConflictError when bot is already present on other board", async () => {
    const boards = boardsService.getAll();
    spyOn(botsService, "get").and.returnValue({
      token: dummyBoardToken,
      botName: "name",
      email: "email",
    } as IBot);
    await boardsService.join(boards[0].id, dummyBoardToken);

    await expect(
      boardsService.join(boards[1].id, dummyBoardToken),
    ).rejects.toThrowError(ConflictError);
  });

  it("Should throw ConflictError when bot is already present on same board", async () => {
    const boards = boardsService.getAll();
    spyOn(botsService, "get").and.returnValue({
      token: dummyBoardToken,
      botName: "name",
      email: "email",
    } as IBot);
    await boardsService.join(boards[0].id, dummyBoardToken);

    await expect(
      boardsService.join(boards[0].id, dummyBoardToken),
    ).rejects.toThrowError(ConflictError);
  });

  it("Should throw NotFoundError when board not exists", async () => {
    spyOn(botsService, "get").and.returnValue({} as IBot);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(NotFoundError);
  });

  it("Should not remove board 1 and 3", async () => {
    spyOn(botsService, "get").and.returnValue({} as IBot);
    let boards = newBoardsService.getAll();
    await newBoardsService.join(boards[2].id, dummyBoardToken);
    newBoardsService.removeEmptyBoards(4);
    boards = newBoardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards[1].id).toEqual(3);
    expect(boards.length).toEqual(2);
  });

  it("Should remove all boards except board 1", async () => {
    spyOn(botsService, "get").and.returnValue({} as IBot);
    let boards = newBoardsService.getAll();
    newBoardsService.removeEmptyBoards(10);
    boards = newBoardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards.length).toEqual(1);
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
