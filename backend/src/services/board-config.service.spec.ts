import { Test, TestingModule } from "@nestjs/testing";
import { BoardConfigRepository } from "../db/repositories/boardConfig.repository";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import { offSeasonId } from "../utils/slack/utils";
import { BoardConfigService } from "./board-config.service";
import { SeasonsService } from "./seasons.service";

describe("BoardConfigService", () => {
  let boardConfigService: BoardConfigService;
  let seasonService: SeasonsService;

  let repositoryMock = {
    create: jest.fn(),
  };

  let seasonsRepositoryMock = {
    getById: jest.fn(),
    getAll: jest.fn(),
    getCurrentSeason: jest.fn(),
    create: jest.fn(),
    dateCollision: jest.fn(),
    getByName: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardConfigService,
        {
          provide: SeasonsService,
          useValue: seasonService,
        },
        {
          provide: BoardConfigRepository,
          useValue: repositoryMock,
        },
        SeasonsService,
        {
          provide: SeasonsRepository,
          useValue: seasonsRepositoryMock,
        },
      ],
    }).compile();

    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    seasonService = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(boardConfigService).toBeDefined();
    expect(seasonService).toBeDefined();
  });

  it("getCurrentBoardConfig, should return off season board config if no current season", () => {
    // arrange
    const mockSeaason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };

    seasonsRepositoryMock.getById.mockReturnValue(mockSeaason);
  });
});
