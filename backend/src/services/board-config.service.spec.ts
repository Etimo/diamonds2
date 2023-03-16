import { TestingModule } from "@nestjs/testing";
import { offSeasonId } from "../utils/slack/utils";
import { BoardConfigService } from "./board-config.service";
import { SeasonsService } from "./seasons.service";
import { GetTestModule, seasonsRepositoryMock } from "./testHelper";

describe("BoardConfigService", () => {
  let boardConfigService: BoardConfigService;
  let seasonService: SeasonsService;

  beforeEach(async () => {
    const module: TestingModule = await GetTestModule();

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
