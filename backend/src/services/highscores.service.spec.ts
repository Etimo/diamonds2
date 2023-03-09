import { Test, TestingModule } from "@nestjs/testing";
import { HighscoresRepository } from "../db/repositories/highscores.repository";
import { IHighscore, INewHighscore } from "../types";
import { offSeasonId } from "../utils/slack/utils";
import { HighscoresService } from "./highscores.service";
import { SeasonsService } from "./seasons.service";

describe("HighScoresService", () => {
  let highScoresService: HighscoresService;
  let repositoryMock = {
    create: jest.fn(),
    allBySeasonIdRaw: jest.fn(),
    getBestBotScore: jest.fn(),
    getBotScore: jest.fn(),
    updateBestBotScore: jest.fn(),
  };

  let seasonServiceMock = {
    getCurrentSeason: jest.fn(),
  };

  let testBotName: string = "testBot";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HighscoresService,
        {
          provide: SeasonsService,
          useValue: seasonServiceMock,
        },
        {
          provide: HighscoresRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    highScoresService = module.get<HighscoresService>(HighscoresService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
  });

  it("Add new score", async () => {
    //arrange
    let newHighScore: INewHighscore = {
      botId: testBotName,
      score: 44,
      seasonId: "Off Season",
    };

    let highScore: IHighscore = {
      ...newHighScore,
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    const mockSeaason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };

    let mockCreate = repositoryMock.create.mockReturnValue(highScore);
    seasonServiceMock.getCurrentSeason.mockReturnValue(mockSeaason);
    repositoryMock.allBySeasonIdRaw.mockReturnValue([]);
    repositoryMock.getBestBotScore.mockReturnValue(null);

    //act
    let res = await highScoresService.addOrUpdate(highScore);

    //assert
    expect(res).toBeTruthy();
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it("getBotScore", async () => {
    //arrange
    let highscore: IHighscore = {
      botId: testBotName,
      score: 100,
      seasonId: "Off Season",
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.getBotScore.mockReturnValue([highscore]);

    //act
    let res = await highScoresService.getBotScore(highscore);

    expect(res).toEqual([highscore]);
  });

  it("addOrUpdate, should update score", async () => {
    //arrange
    let highscore: IHighscore = {
      botId: testBotName,
      score: 44,
      seasonId: "Off Season",
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };
    let botHighScore = {
      botId: testBotName,
      score: 84,
      seasonId: "Off Season",
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.allBySeasonIdRaw.mockReturnValue([highscore]);
    repositoryMock.getBestBotScore.mockReturnValue(highscore);

    //act
    await highScoresService.addOrUpdate(botHighScore);

    //assert
    expect(repositoryMock.updateBestBotScore).toHaveBeenCalled();
  });

  it("Ignore lower score", async () => {
    //arrange
    let botLowScore: IHighscore = {
      botId: testBotName,
      score: 44,
      seasonId: "Off Season",
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };
    let botHighScore = {
      botId: testBotName,
      score: 84,
      seasonId: "Off Season",
      id: "c43eee94-f363-4097-85e2-db3b48ed2d79",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    //act
    repositoryMock.allBySeasonIdRaw.mockReturnValue([botHighScore]);
    repositoryMock.getBestBotScore.mockReturnValue(botHighScore);
    await highScoresService.addOrUpdate(botLowScore);

    //assert
    expect(repositoryMock.create).toHaveBeenCalledTimes(0);
    expect(repositoryMock.updateBestBotScore).toHaveBeenCalledTimes(0);
  });
});
