import { TestingModule } from "@nestjs/testing";
import { BoardConfigService } from "./board-config.service";
import { BoardConfigDto } from "../models/board-config.dto";
import { createTestingModule } from "../test-utils";
import { BoardConfigRepository } from "../db/repositories/board-config.repository";

describe("BoardConfigService", () => {
  let boardConfigService: BoardConfigService;
  let boardConfigRepository: BoardConfigRepository;

  const boardConfig: BoardConfigDto = {
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

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule();
    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    boardConfigRepository = module.get(BoardConfigRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return config for current season", async () => {
    spyOn(boardConfigRepository, "getForSeason").and.returnValue(boardConfig);

    return expect(boardConfigService.getCurrentBoardConfig()).resolves.toEqual(
      boardConfig,
    );
  });

  it("should return config for off season if current season not found", async () => {
    const mock = spyOn(boardConfigRepository, "getForSeason");
    mock.and.returnValues(null, boardConfig);

    return expect(boardConfigService.getCurrentBoardConfig()).resolves.toEqual(
      boardConfig,
    );
  });
});
