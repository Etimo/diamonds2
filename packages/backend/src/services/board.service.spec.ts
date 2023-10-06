import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TestingModule } from "@nestjs/testing";
import { ConflictError, UnauthorizedError } from "../errors";
import { IBot } from "../types";
import { BoardsService } from "./board.service";
import { BotsService } from "./bots.service";
import { HighscoresService } from "./highscores.service";
import { SeasonsService } from "./seasons.service";
import {
  boardConfigRepositoryMock,
  botRepositryMock,
  createTestModule,
  offSeasonTest,
  seasonsRepositoryMock,
} from "./test-helper.spec";

let botTest: IBot;

describe("BoardsService", () => {
  let botsService: BotsService;
  let highscoresService: HighscoresService;
  let seasonsService: SeasonsService;
  let boardsService: BoardsService;

  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";

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

  let numberOfBoards = 1;
  let numberOfEphemeralBoards = 1;
  let botId = "65d70ce4-ae31-47f5-a72f-16c45180881d";
  let dummyBotId = "11111111-1111-1111-1111-111111111111";

  botTest = {
    id: botId,
    name: "bot1",
    email: "email",
    password: "password",
    createTimeStamp: new Date(),
    updateTimeStamp: new Date(),
    teamId: "Team",
  };

  beforeEach(async () => {
    seasonsRepositoryMock.getCurrentSeason.mockReturnValue(offSeasonTest);
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const module: TestingModule = await createTestModule();

    highscoresService = module.get<HighscoresService>(HighscoresService);
    botsService = module.get<BotsService>(BotsService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    boardsService = module.get<BoardsService>(BoardsService);
    numberOfBoards = module.get<number>("NUMBER_OF_BOARDS");
    numberOfEphemeralBoards = module.get<number>("MAX_EPHEMERAL_BOARDS");
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highscoresService).toBeDefined();
    expect(botsService).toBeDefined();
    expect(boardsService).toBeDefined();
    expect(seasonsService).toBeDefined();
  });

  it("Should throw UnauthorizedError when bot not exists", async () => {
    botRepositryMock.get.mockReturnValue(null);
    await expect(
      boardsService.join(dummyBotId, dummyBoardId),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("getAll, should be possible to get all boards", () => {
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const boards = boardsService.getAll();

    expect(boards.length).toBe(numberOfBoards + numberOfEphemeralBoards);
  });

  it("join, should be possible to join board", async () => {
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);
    botRepositryMock.get.mockReturnValueOnce(botTest);

    let boards = boardsService.getAll();

    let lenBefore = boards[0].gameObjects.length;

    let board = await boardsService.join(botId, boards[0].id);

    expect(board).toBeDefined();
    expect(board.gameObjects.length).toBe(lenBefore + 2);
  });

  it("join, should throw unauthorized when bot is not defined", () => {
    boardConfigRepositoryMock.getBoardConfigById.mockReturnValue(boardConfig);

    const boards = boardsService.getAll();

    const board = boardsService.join(dummyBotId, boards[0].id);

    expect(board).rejects.toThrow(UnauthorizedError);
  });

  it("Should throw ConflictError when bot is already present on other board", async () => {
    let boards = boardsService.getAll();
    botRepositryMock.get.mockReturnValue(botTest);

    await boardsService.join(botId, boards[0].id);
    let act = boardsService.join(botId, boards[1].id);
    expect(act).rejects.toThrowError(ConflictError);
    expect(act).rejects.toThrowError("Already playing");
  });

  it("Should throw ConflictError when bot is already present on same board", async () => {
    let boards = boardsService.getAll();
    botRepositryMock.get.mockReturnValue({
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      password: "password",
      teamId: "team",
      id: dummyBoardToken,
      name: "name",
      email: "email",
    } as IBot);
    await boardsService.join(botId, boards[0].id);
    await expect(boardsService.join(botId, boards[0].id)).rejects.toThrowError(
      ConflictError,
    );
  });

  it("Should throw ConflictError when board not exists", async () => {
    botRepositryMock.get.mockReturnValue(botTest);
    await expect(boardsService.join(botId, dummyBoardId)).rejects.toThrowError(
      ConflictError,
    );
  });
});
