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
import { BoardConfigService } from "src/services/board-config.service";

describe("AutoScaleBourdsMiddleWare", () => {
  let boardsService: BoardsService;
  let newBoardsService: BoardsService;
  let highScoresService: HighScoresService;
  let botsService: BotsService;
  let seasonsService: SeasonsService;
  let autoScaleBoardsMiddleware: AutoScaleMiddleware;
  let boardConfigService: BoardConfigService;

  beforeEach(async () => {
    boardsService = new BoardsService(
      botsService,
      highScoresService,
      null,
      seasonsService,
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

  it("should 0 boards", () => {
    autoScaleBoardsMiddleware.setRequestCount(1500);
    autoScaleBoardsMiddleware.setControlAt(-3);
    autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should return 7 boards", () => {
    autoScaleBoardsMiddleware.setRequestCount(8000);
    autoScaleBoardsMiddleware.setControlAt(-3);
    autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(7);
  });

  it("should 12 boards", () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(-3);
    autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
  });

  it("should return 4 boards", () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(1);
    autoScaleBoardsMiddleware.autoScaleBoards();

    const boards = boardsService.getAll();

    expect(boards.length).toEqual(4);
  });

  it("should return 7", () => {
    autoScaleBoardsMiddleware.setRequestCount(14000);
    autoScaleBoardsMiddleware.setControlAt(-2);
    // Adding boards with middleware
    autoScaleBoardsMiddleware.autoScaleBoards();

    let boards = boardsService.getAll();

    expect(boards.length).toEqual(12);
    autoScaleBoardsMiddleware.setRequestCount(8000);
    autoScaleBoardsMiddleware.setControlAt(-2);
    // Removing boards with middleware
    autoScaleBoardsMiddleware.autoScaleBoards();

    boards = boardsService.getAll();
    expect(boards.length).toEqual(7);
  });
});
