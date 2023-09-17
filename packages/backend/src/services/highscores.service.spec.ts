import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { TestingModule } from "@nestjs/testing";
import { IHighscore, INewHighscore } from "../types";
import { offSeasonId } from "../utils";
import { HighscoresService } from "./highscores.service";
import { SeasonsService } from "./seasons.service";
import {
  createTestModule,
  highscoresRepositoryMock,
  seasonsRepositoryMock,
} from "./test-helper.spec";

describe("HighScoresService", () => {
  let highScoresService: HighscoresService;
  let seasonsService: SeasonsService;

  let testBotName: string = "testBot";

  beforeEach(async () => {
    const module: TestingModule = await createTestModule();

    highScoresService = module.get<HighscoresService>(HighscoresService);
    seasonsService = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(seasonsService).toBeDefined();
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

    let mockCreate = highscoresRepositoryMock.create.mockReturnValue(highScore);

    seasonsRepositoryMock.getCurrentSeason.mockReturnValue(mockSeaason);
    highscoresRepositoryMock.allBySeasonIdRaw.mockReturnValue([]);
    highscoresRepositoryMock.getBestBotScore.mockReturnValue(null);

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

    highscoresRepositoryMock.getBotScore.mockReturnValue([highscore]);

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

    highscoresRepositoryMock.allBySeasonIdRaw.mockReturnValue([highscore]);
    highscoresRepositoryMock.getBestBotScore.mockReturnValue(highscore);

    //act
    await highScoresService.addOrUpdate(botHighScore);

    //assert
    expect(highscoresRepositoryMock.updateBestBotScore).toHaveBeenCalled();
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
    highscoresRepositoryMock.allBySeasonIdRaw.mockReturnValue([botHighScore]);
    highscoresRepositoryMock.getBestBotScore.mockReturnValue(botHighScore);
    await highScoresService.addOrUpdate(botLowScore);

    //assert
    expect(highscoresRepositoryMock.create).toHaveBeenCalledTimes(0);
    expect(highscoresRepositoryMock.updateBestBotScore).toHaveBeenCalledTimes(
      0,
    );
  });
});
