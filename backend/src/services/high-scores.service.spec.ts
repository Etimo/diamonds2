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

describe("HighScoresService", () => {
  let highScoresService: HighScoresService;
  let seasonService: SeasonsService;
  let testBotName: string = "testBot";
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";
  let repositoryMock: MockType<Repository<HighScoreEntity>>;
  let repositoryMock1: MockType<Repository<SeasonsEntity>>;

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
          useFactory: repositoryMockFactory,
        },
        HighScoresService,
        {
          provide: MetricsService,
          useValue: null,
        },
        {
          provide: getRepositoryToken(HighScoreEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    highScoresService = module.get<HighScoresService>(HighScoresService);
    seasonService = module.get<SeasonsService>(SeasonsService);
    repositoryMock = module.get(getRepositoryToken(HighScoreEntity));
    repositoryMock1 = module.get(getRepositoryToken(SeasonsEntity));
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(highScoresService).toBeDefined();
    expect(seasonService).toBeDefined();
  });

  it("Add new score", async () => {
    let newHighScoreDto = {
      botName: testBotName,
      score: 44,
      seasonId: "Off Season",
    };

    //Mocking find from repository
    repositoryMock.find.mockReturnValue(
      new Promise<HighscoreDto[]>((resolve, reject) => {
        var savedPackage: HighscoreDto[] = [newHighScoreDto];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    //Mocking find from seasonsService
    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = currentSeason;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock1.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    //Insert new HighScore
    await highScoresService.addOrUpdate(newHighScoreDto);

    let highscoreDtoItems = await highScoresService.getBotScore(
      newHighScoreDto,
    );

    expect(highscoreDtoItems.length).toEqual(1);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(repositoryMock.save).toHaveBeenCalledWith(newHighScoreDto);
  });

  it("getBotScore", async () => {
    let highscore = {
      botName: testBotName,
      score: 100,
      seasonId: "Off Season",
    };

    repositoryMock.find.mockReturnValue(
      new Promise<HighscoreDto[]>((resolve, reject) => {
        var savedPackage: HighscoreDto[] = [highscore];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    expect(await highScoresService.getBotScore(highscore)).toEqual([highscore]);
    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: [{ botName: highscore.botName }],
    });
  });

  test("Update score", async () => {
    //same botName, different score
    let botLowScore = {
      botName: testBotName,
      score: 44,
      seasonId: "Off Season",
    };
    let botHighScore = {
      botName: testBotName,
      score: 84,
      seasonId: "Off Season",
    };

    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOneSeason = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = currentSeason;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const whereSeason = jest.fn(() => ({ getOne: getOneSeason }));

    repositoryMock1.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: whereSeason })),
    );

    //insert first botLowScore
    await highScoresService.addOrUpdate(botLowScore);

    expect(repositoryMock.save).toHaveBeenCalledWith(botLowScore);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);

    const getOne = jest.fn(
      () =>
        new Promise<HighscoreDto>((resolve, reject) => {
          var savedPackage: HighscoreDto = botLowScore;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ update: update, where: where2 })),
    );

    await highScoresService.addOrUpdate(botHighScore);

    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(1);

    repositoryMock.find.mockReturnValue(
      new Promise<HighscoreDto[]>((resolve, reject) => {
        var savedPackage: HighscoreDto[] = [botHighScore];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    //find bot
    let highscoreDtoItems = await highScoresService.getBotScore(botHighScore);
    //only one result when looking  bot with testBotName
    expect(highscoreDtoItems.length).toEqual(1);

    expect(highscoreDtoItems[0].score).toEqual(botHighScore.score);
  });

  it("Ignore lower score", async () => {
    let botHighScore = {
      botName: testBotName,
      score: 5,
      seasonId: "Off Season",
    };
    let botLowScore = {
      botName: testBotName,
      score: 4,
      seasonId: "Off Season",
    };

    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOneSeason = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = currentSeason;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const whereSeason = jest.fn(() => ({ getOne: getOneSeason }));

    repositoryMock1.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: whereSeason })),
    );

    await highScoresService.addOrUpdate(botHighScore);

    //insert botHighScore
    expect(repositoryMock.save).toHaveBeenCalledWith(botHighScore);
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);

    const getOne = jest.fn(
      () =>
        new Promise<HighscoreDto>((resolve, reject) => {
          var savedPackage: HighscoreDto = botHighScore;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ update: update, where: where2 })),
    );

    await highScoresService.addOrUpdate(botLowScore);

    // Save calls should not increase.
    expect(repositoryMock.save).toHaveBeenCalledTimes(1);
    expect(update).toHaveBeenCalledTimes(0);

    repositoryMock.find.mockReturnValue(
      new Promise<HighscoreDto[]>((resolve, reject) => {
        var savedPackage: HighscoreDto[] = [botHighScore];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    let highscoreDtoItems = await highScoresService.getBotScore(botLowScore);

    expect(highscoreDtoItems.length).toEqual(1);

    expect(highscoreDtoItems[0].score).toEqual(botHighScore.score);
  });
});

// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    findOne: jest.fn(entity => entity),
    find: jest.fn(entity => entity),
    update: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      where: jest.fn(() => ({ getOne: jest.fn(entity => entity) })),
      getOne: jest.fn(),
    })),
    execute: jest.fn(entity => entity),
    where: jest.fn(),
  }),
);
export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
