import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TestingModule } from "@nestjs/testing";
import { offSeasonId } from "../utils";
import { BoardConfigService } from "./board-config.service";
import { SeasonsService } from "./seasons.service";
import { createTestModule, seasonsRepositoryMock } from "./test-helper.spec";

describe("BoardConfigService", () => {
  let boardConfigService: BoardConfigService;
  let seasonService: SeasonsService;

  beforeEach(async () => {
    const module: TestingModule = await createTestModule();

    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    seasonService = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(boardConfigService).toBeDefined();
    expect(seasonService).toBeDefined();
  });

  it("getCurrentBoardConfig, should return off season board config if no current season", () => {
    const mockSeaason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };

    seasonsRepositoryMock.getById.mockReturnValue(mockSeaason);
  });
});
