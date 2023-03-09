import { Test, TestingModule } from "@nestjs/testing";
import { BoardConfigRepository } from "../db/repositories/boardConfig.repository";
import { BoardConfigService } from "./board-config.service";
import { SeasonsService } from "./seasons.service";

describe("BoardConfigService", () => {
  let boardConfigService: BoardConfigService;
  let seasonServiceMock = {
    getCurrentSeason: jest.fn(),
  };

  let repositoryMock = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardConfigService,
        {
          provide: SeasonsService,
          useValue: seasonServiceMock,
        },
        {
          provide: BoardConfigRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    boardConfigService = module.get<BoardConfigService>(BoardConfigService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(boardConfigService).toBeDefined();
  });

  //TODO: add tests //Klara
});
