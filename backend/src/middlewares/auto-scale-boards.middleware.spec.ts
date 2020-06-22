import { BoardsService } from "../services/board.service";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepository } from "typeorm";
import { HighScoresService } from "../services/high-scores.service";
import { BotsService } from "../services/bots.service";
import { SeasonsService } from "../services/seasons.service";
import SilentLogger from "../gameengine/util/silent-logger";
import { CustomLogger } from "../logger";
import { Board } from "../gameengine/board";
import { AutoScaleMiddleware } from "./auto-scale-boards.middleware";
import { create } from "domain";

describe("AutoScaleBourdsMiddleWare", () => {
  let boardsService: BoardsService;
  let newBoardsService: BoardsService;
  let highScoresService: HighScoresService;
  let botsService: BotsService;
  let seasonsService: SeasonsService;
  let autoScaleBourdsMiddleWare: AutoScaleMiddleware;

  beforeEach(async () => {
    Board.setNextId(1);
    boardsService = new BoardsService(
      botsService,
      highScoresService,
      null,
      seasonsService,
      new SilentLogger() as CustomLogger,
      4,
    );

    jest.clearAllMocks();
  });

  const createMiddleware = (boardsService, requests, date) => {
    return new AutoScaleMiddleware(boardsService, requests, date);
  };

  const getNewDate = minutes => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    return new Date(now);
  };

  it("should be defined", () => {
    expect(highScoresService).toBeDefined;
    expect(botsService).toBeDefined;
    expect(seasonsService).toBeDefined;
    expect(boardsService).toBeDefined;
  });

  it("should 0 boards", () => {
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      1500,
      getNewDate(-3),
    );
    autoScaleBourdsMiddleWare.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should 7 boards", () => {
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      8000,
      getNewDate(-3),
    );
    autoScaleBourdsMiddleWare.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(7);
  });

  it("should 12 boards", () => {
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      14000,
      getNewDate(-3),
    );
    autoScaleBourdsMiddleWare.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
  });

  it("should return 4 boards", () => {
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      14000,
      getNewDate(1),
    );
    autoScaleBourdsMiddleWare.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should return 7", () => {
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      14000,
      getNewDate(-2),
    );
    // Adding boards with middleware
    autoScaleBourdsMiddleWare.autoScaleBoards();

    let boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
    autoScaleBourdsMiddleWare = createMiddleware(
      boardsService,
      8000,
      getNewDate(-2),
    );
    // Removing boards with middleware
    autoScaleBourdsMiddleWare.autoScaleBoards();

    boards = boardsService.getAll();
    expect(boards.length).toEqual(7);
  });
});
