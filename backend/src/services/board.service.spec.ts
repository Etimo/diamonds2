import { BoardsService } from "./board.service";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { TestingModule } from "@nestjs/testing";
import { HighScoresService } from "./high-scores.service";

import { getRepositoryToken } from "@nestjs/typeorm";
import { BotsService } from "./bots.service";
import { HighScoreEntity } from "../db/models/highScores.entity";
import UnauthorizedError from "../errors/unauthorized.error";
import { IBot } from "../interfaces/bot.interface";
import NotFoundError from "../errors/not-found.error";
import { SeasonsService } from "./seasons.service";
import { SeasonsEntity } from "../db/models/seasons.entity";
import ConflictError from "../errors/conflict.error";
import { RecordingsService } from "./recordings.service";
import { BoardConfigService } from "./board-config.service";
import { BoardConfigEntity } from "../db/models/boardConfig.entity";
import { BoardConfigDto } from "src/models/board-config.dto";
import { createTestingModule } from "../test-utils";

describe("BoardsService", () => {
  const dummyBoardId = 1111111;
  const dummyBoardToken = "dummy";
  const dummyBotId = "dummyId";
  let boardsService: BoardsService;
  let newBoardsService: BoardsService;
  let boardConfigService: BoardConfigService;
  let botsService: BotsService;
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
    const module: TestingModule = await createTestingModule();
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    botsService = module.get<BotsService>(BotsService);
    spyOn(boardConfigService, "getCurrentBoardConfig").and.returnValue(
      boardConfig,
    );
    boardsService = module.get<BoardsService>(BoardsService);
    boardsService.setup();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should throw UnauthorizedError when bot not exists", async () => {
    spyOn(botsService, "get").and.returnValue(undefined);
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(UnauthorizedError);
  });

  it("should throw ConflictError when bot is already present on other board", async () => {
    const boards = boardsService.getAll();
    spyOn(botsService, "get").and.returnValue({
      token: dummyBoardToken,
      botName: "name",
      email: "email",
    });
    await boardsService.join(boards[0].id, dummyBoardToken);

    await expect(
      boardsService.join(boards[1].id, dummyBoardToken),
    ).rejects.toThrowError(ConflictError);
  });

  it("should throw ConflictError when bot is already present on same board", async () => {
    const boards = boardsService.getAll();
    spyOn(botsService, "get").and.returnValue({
      token: dummyBoardToken,
      botName: "name",
      email: "email",
    });
    await boardsService.join(boards[0].id, dummyBoardToken);

    await expect(
      boardsService.join(boards[0].id, dummyBoardToken),
    ).rejects.toThrowError(ConflictError);
  });

  it("should throw NotFoundError when board not exists", async () => {
    spyOn(botsService, "get").and.returnValue({});
    await expect(
      boardsService.join(dummyBoardId, dummyBoardToken),
    ).rejects.toThrowError(NotFoundError);
  });

  it("should not remove board 1 and 3", async () => {
    spyOn(botsService, "get").and.returnValue({});
    let boards = boardsService.getAll();
    await boardsService.join(boards[2].id, dummyBoardToken);

    boardsService.removeEmptyBoards(4);

    boards = boardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards[1].id).toEqual(3);
    expect(boards.length).toEqual(2);
  });

  it("should remove all boards except board 1", async () => {
    spyOn(botsService, "get").and.returnValue({});
    let boards = boardsService.getAll();

    boardsService.removeEmptyBoards(10);

    boards = boardsService.getAll();
    expect(boards[0].id).toEqual(1);
    expect(boards.length).toEqual(1);
  });
});
