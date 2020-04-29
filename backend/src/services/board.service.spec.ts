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

describe("BoardsService", () => {
  let botsService: BotsService;
  let highScoresService: HighScoresService;
  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";
  const dummyBotId = "dummyId";
  let boardsService: BoardsService;
  let repositoryMock: MockType<Repository<HighScoreEntity>>;
  let repositoryMock2: MockType<Repository<BotRegistrationsEntity>>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        {
          provide: getRepositoryToken(BotRegistrationsEntity),
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
      ],
    }).compile();
    highScoresService = module.get<HighScoresService>(HighScoresService);
    botsService = module.get<BotsService>(BotsService);

    repositoryMock = module.get(getRepositoryToken(HighScoreEntity));
    repositoryMock2 = module.get(getRepositoryToken(BotRegistrationsEntity));
    boardsService = new BoardsService(
      botsService,
      highScoresService,
      null,
      new SilentLogger() as CustomLogger,
    );

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(botsService).toBeDefined();
    expect(boardsService).toBeDefined();
  });

  it("Should throw UnauthorizedError when bot not exists", async () => {
    spyOn(botsService, "get").and.returnValue(undefined);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("Should throw NotFoundError when board not exists", async () => {
    spyOn(botsService, "get").and.returnValue({} as IBot);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(NotFoundError);
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
