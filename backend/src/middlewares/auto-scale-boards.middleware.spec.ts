import { BoardsService } from "../services/board.service";
import { Repository } from "typeorm";
import { TestingModule, Test } from "@nestjs/testing";
import { HighScoresService } from "../services/high-scores.service";
import { BotsService } from "../services/bots.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonsService } from "../services/seasons.service";
import SilentLogger from "../gameengine/util/silent-logger";
import { CustomLogger } from "../logger";
import { AutoScaleMiddleware } from "./auto-scale-boards.middleware";
import { RecordingsService } from "../services/recordings.service";
import { BoardConfigService } from "../services/board-config.service";
import { BoardConfigDto } from "../models/board-config.dto";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { MetricsService } from "../services/metrics.service";
import { TeamsService } from "../services/teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { HighscoresRepository } from "../db/repositories/highscores.repository";

describe("AutoScaleBourdsMiddleWare", () => {
  let boardsService: BoardsService;
  let highScoresService: HighScoresService;
  let botsService: BotsService;
  let seasonsService: SeasonsService;
  let autoScaleBoardsMiddleware: AutoScaleMiddleware;
  let recordingsService: RecordingsService;
  let boardConfigService: BoardConfigService;
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
        BoardConfigService,
        {
          provide: getRepositoryToken(BoardConfigEntity),
          useFactory: repositoryMockFactory,
        },
        {
          useValue: 4,
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
      4,
    );

    autoScaleBoardsMiddleware = new AutoScaleMiddleware(boardsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined;
    expect(botsService).toBeDefined;
    expect(seasonsService).toBeDefined;
    expect(boardsService).toBeDefined;
    expect(boardConfigService).toBeDefined;
  });

  it("should 0 boards", async () => {
    autoScaleBoardsMiddleware.setRequestCount(1500);
    autoScaleBoardsMiddleware.setControlAt(-3);
    await autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should return 7 boards", async () => {
    autoScaleBoardsMiddleware.setRequestCount(8000);
    autoScaleBoardsMiddleware.setControlAt(-3);
    await autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(7);
  });

  it("should 12 boards", async () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(-3);
    await autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
  });

  it("should return 4 boards", async () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(1);
    await autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should return 7", async () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(-2);
    // Adding boards with middleware
    await autoScaleBoardsMiddleware.autoScaleBoards();

    let boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
    autoScaleBoardsMiddleware.setRequestCount(8000);
    autoScaleBoardsMiddleware.setControlAt(-2);
    // Removing boards with middleware
    await autoScaleBoardsMiddleware.autoScaleBoards();

    boards = boardsService.getAll();
    expect(boards.length).toEqual(7);
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
