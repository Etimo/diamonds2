import { HighScoresService } from "./high-scores.service";
import { Repository, SelectQueryBuilder, Connection } from "typeorm";
import { HighScoreEntity } from "../db/models/highScores.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { HighscoreDto } from "../models/highscore.dto";
import { getRepositoryToken } from "@nestjs/typeorm";
import { MetricsService } from "./metrics.service";
import { SeasonsService } from "./seasons.service";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { SeasonDto } from "../models/season.dto";
import { HighscoresRepository } from "../db/repositories/highscores.repository";

describe("HighScoresService", () => {
  let highScoresService: HighScoresService;
  let seasonService: SeasonsService;
  let testBotName: string = "testBot";
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";
  let highscoresRepository: HighscoresRepository;

  let currentSeason = {
    id: seasonId,
    name: "Off Season",
    startDate: new Date(),
    endDate: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        {
          provide: getRepositoryToken(SeasonsEntity),
          useFactory: jest.fn(),
        },
        HighScoresService,
        HighscoresRepository,
        {
          provide: getRepositoryToken(HighScoreEntity),
          useFactory: jest.fn(),
        },
        {
          provide: MetricsService,
          useValue: null,
        },
      ],
    }).compile();
    highScoresService = module.get<HighScoresService>(HighScoresService);
    seasonService = module.get<SeasonsService>(SeasonsService);
    highscoresRepository = module.get<HighscoresRepository>(
      HighscoresRepository,
    );
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(seasonService).toBeDefined();
  });

  // it("Add new score", async () => {
  //   let newHighScoreDto = {
  //     botName: testBotName,
  //     score: 44,
  //     seasonId: "Off Season",
  //   };

  //   const mock = jest.spyOn(highscoresRepository, "create");

  //   await highScoresService.addOrUpdate(newHighScoreDto);

  //   expect(mock).toHaveBeenCalledTimes(1);
  // });

  // it("getBotScore", async () => {
  //   let highscore = {
  //     botName: testBotName,
  //     score: 100,
  //     seasonId: "Off Season",
  //   };

  //   const mock = jest
  //     .spyOn(highscoresRepository, "getBotScore")
  //     .mockReturnValue(new Promise(resolve => resolve([highscore])));

  //   expect(await highScoresService.getBotScore(highscore)).toEqual([highscore]);
  // });

  // test("Update score", async () => {
  //   let botLowScore: HighscoreDto = {
  //     botName: testBotName,
  //     score: 44,
  //     seasonId: "Off Season",
  //   };
  //   let botHighScore = {
  //     botName: testBotName,
  //     score: 84,
  //     seasonId: "Off Season",
  //   };

  //   const mock = jest.spyOn(highscoresRepository, "getBestBotScore");
  //   const mockUpdate = jest.spyOn(highscoresRepository, "updateBestBotScore");

  //   await highScoresService.addOrUpdate(botHighScore);

  //   expect(mockUpdate).toHaveBeenCalledWith(botHighScore);
  // });

  // it("Ignore lower score", async () => {
  //   let botHighScore = {
  //     botName: testBotName,
  //     score: 5,
  //     seasonId: "Off Season",
  //   };
  //   let botLowScore = {
  //     botName: testBotName,
  //     score: 4,
  //     seasonId: "Off Season",
  //   };

  //   await highScoresService.addOrUpdate(botHighScore);

  //   await highScoresService.addOrUpdate(botLowScore);

  //   // Save calls should not increase.
  //   expect(repositoryMock.save).toHaveBeenCalledTimes(1);
  //   expect(update).toHaveBeenCalledTimes(0);

  //   let highscoreDtoItems = await highScoresService.getBotScore(botLowScore);

  //   expect(highscoreDtoItems.length).toEqual(1);

  //   expect(highscoreDtoItems[0].score).toEqual(botHighScore.score);
  // });
});
