import { TestingModule } from "@nestjs/testing";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import UnauthorizedError from "../errors/unauthorized.error";
import { IBot } from "../types";
import { BoardConfigService } from "./board-config.service";
import { BoardsService } from "./board.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { RecordingsService } from "./recordings.service";
import { SeasonsService } from "./seasons.service";
import {
  boardConfigRepositoryMock,
  botRepositryMock,
  GetTestModule,
  offSeasonTest,
  seasonsRepositoryMock,
} from "./testHelper";

describe("BoardsService", () => {
  let botsService: BotsService;
  let highscoresService: HighscoresService;
  let seasonsService: SeasonsService;
  let boardsService: BoardsService;
  let boardConfigService: BoardConfigService;
  let newBoardsService: BoardsService;
  let recordingsService: RecordingsService;

  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";
  const dummyBotId = "dummyId";

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

    const module: TestingModule = await GetTestModule();

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
