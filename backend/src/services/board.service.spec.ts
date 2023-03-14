import { Test, TestingModule } from "@nestjs/testing";
import { BoardConfigRepository } from "../db/repositories/boardConfig.repository";
import { BotRegistrationsRepository } from "../db/repositories/botRegistrations.repository";
import { HighscoresRepository } from "../db/repositories/highscores.repository";
import { RecordingsRepository } from "../db/repositories/recordings.repository";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import { TeamsRepository } from "../db/repositories/teams.repository";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import UnauthorizedError from "../errors/unauthorized.error";
import SilentLogger from "../gameengine/util/silent-logger";
import { CustomLogger } from "../logger";
import { IBot } from "../types";
import { offSeasonId } from "../utils/slack/utils";
import { BoardConfigService } from "./board-config.service";
import { BoardsService } from "./board.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { RecordingsService } from "./recordings.service";
import { SeasonsService } from "./seasons.service";
import { TeamsService } from "./teams.service";

describe("BoardsService", () => {
  let botsService: BotsService;
  let highscoresService: HighscoresService;
  let seasonsService: SeasonsService;
  let boardsService: BoardsService;
  let boardConfigService: BoardConfigService;
  let newBoardsService: BoardsService;
  let recordingsService: RecordingsService;
  let teamsService: TeamsService;

  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";
  const dummyBotId = "dummyId";
  let seasonsRepositoryMock = {
    getById: jest.fn(),
    getAll: jest.fn(),
    getCurrentSeason: jest.fn(),
    create: jest.fn(),
    dateCollision: jest.fn(),
    getByName: jest.fn(),
  };

  let offSeasonTest = {
    id: offSeasonId,
    name: "Off Season",
    startDate: new Date(),
    endDate: new Date(),
  };

  let highescoresRepositoryMock = {
    create: jest.fn(),
    allBySeasonIdRaw: jest.fn(),
    getBestBotScore: jest.fn(),
    getBotScore: jest.fn(),
    updateBestBotScore: jest.fn(),
  };

  let botRepositryMock = {
    get: jest.fn(),
  };
  let recordingsRepositoryMock = {
    getById: jest.fn(),
  };
  let teamsRepositoryMock = {
    getById: jest.fn(),
  };
  let boardConfigRepositoryMock = {
    getBoardConfigById: jest.fn(),
  };
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

  const numberOfBoards = 4;

  beforeEach(async () => {
    seasonsRepositoryMock.getCurrentSeason.mockReturnValue(offSeasonTest);
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
          useValue: highescoresRepositoryMock,
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

    highscoresService = module.get<HighscoresService>(HighscoresService);
    botsService = module.get<BotsService>(BotsService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    recordingsService = module.get<RecordingsService>(RecordingsService);
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    boardsService = module.get<BoardsService>(BoardsService);
    newBoardsService = module.get<BoardsService>(BoardsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highscoresService).toBeDefined();
    expect(botsService).toBeDefined();
    expect(boardsService).toBeDefined();
    expect(seasonsService).toBeDefined();
  });

  it("Should throw UnauthorizedError when bot not exists", async () => {
    //spyOn(botsService, "get").and.returnValue(undefined);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("getAll, should be possible to get all boards", () => {
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const boards = boardsService.getAll();

    expect(boards.length).toBe(numberOfBoards);
  });

  it("join, should be possible to join board", async () => {
    const botId = "1";
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);
    const botTest: IBot = {
      email: "email",
      password: "password",
      name: "bot2",
      id: botId,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: "Team",
    };
    botRepositryMock.get.mockReturnValueOnce(botTest);

    const boards = boardsService.getAll();

    const lenBefore = boards[0].gameObjects.length;

    let board = await boardsService.join(boards[0].id, botId);

    expect(board).toBeDefined();
    expect(board.gameObjects.length).toBe(lenBefore + 2);
  });

  it("join, should throw unauthorized when bot is not defined", () => {
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const boards = boardsService.getAll();

    const board = boardsService.join(boards[0].id, "hejhej");

    expect(board).rejects.toThrow(UnauthorizedError);
  });

  it("Should throw ConflictError when bot is already present on other board", async () => {
    const boards = boardsService.getAll();
    botRepositryMock.get.mockReturnValue({
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      password: "password",
      teamId: "team",
      id: dummyBoardToken,
      name: "name",
      email: "email",
    } as IBot);

    await boardsService.join(boards[0].id, dummyBoardToken);
    let act = boardsService.join(boards[1].id, dummyBoardToken);
    expect(act).rejects.toThrowError(ConflictError);
  });

  it("Should throw ConflictError when bot is already present on same board", async () => {
    const boards = boardsService.getAll();
    botRepositryMock.get.mockReturnValue({
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      password: "password",
      teamId: "team",
      id: dummyBoardToken,
      name: "name",
      email: "email",
    } as IBot);
    await boardsService.join(boards[0].id, dummyBoardToken);
    await expect(
      boardsService.join(boards[0].id, dummyBoardToken),
    ).rejects.toThrowError(ConflictError);
  });
  it("Should throw NotFoundError when board not exists", async () => {
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(NotFoundError);
  });
  it("Should not remove board 1 and 3", async () => {
    botRepositryMock.get.mockReturnValue({} as IBot);
    let boards = newBoardsService.getAll();
    await newBoardsService.join(boards[2].id, dummyBoardToken);
    newBoardsService.removeEmptyBoards(4);
    boards = newBoardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards[1].id).toEqual(3);
    expect(boards.length).toEqual(2);
  });
  it("Should remove all boards except board 1", async () => {
    botRepositryMock.get.mockReturnValue({} as IBot);
    let boards = newBoardsService.getAll();
    newBoardsService.removeEmptyBoards(10);
    boards = newBoardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards.length).toEqual(1);
  });
});
