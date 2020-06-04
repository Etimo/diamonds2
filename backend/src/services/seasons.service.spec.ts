import { SeasonsService } from "./seasons.service";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonDto } from "../models/season.dto";

describe("SeasonsService", () => {
  let seasonsService: SeasonsService;
  let repositoryMock: MockType<Repository<SeasonsEntity>>;
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeasonsService,
        {
          provide: getRepositoryToken(SeasonsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    seasonsService = module.get<SeasonsService>(SeasonsService);
    repositoryMock = module.get(getRepositoryToken(SeasonsEntity));
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(seasonsService).toBeDefined();
  });

  it("should get one item in list", async () => {
    //Mocking find from repository
    repositoryMock.find.mockReturnValue(
      new Promise<SeasonDto[]>((resolve, reject) => {
        var savedPackage: SeasonDto[] = [];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    let all = await seasonsService.all();

    expect(all.length).toEqual(1);
  });

  it("should get two item in list", async () => {
    let todaysDate = new Date();
    let yesterdaysDate = todaysDate.setDate(todaysDate.getDate() - 1);
    let futureDate = todaysDate.setDate(todaysDate.getDate() + 10);

    let testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(yesterdaysDate),
      endDate: new Date(futureDate),
    };
    //Mocking find from repository
    repositoryMock.find.mockReturnValue(
      new Promise<SeasonDto[]>((resolve, reject) => {
        var savedPackage: SeasonDto[] = [testSeason];

        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    let all = await seasonsService.all();

    expect(all.length).toEqual(2);
  });

  it("should get off season, exists no other seasons", async () => {
    //Mocking find from repository

    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = null;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    let currentSeason = await seasonsService.getCurrentSeason();

    expect(currentSeason.name).toEqual("Off Season");
  });

  it("should return Test Season", async () => {
    let todaysDate = new Date();
    let yesterdaysDate = todaysDate.setDate(todaysDate.getDate() - 1);
    let futureDate = todaysDate.setDate(todaysDate.getDate() + 10);

    let testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(yesterdaysDate),
      endDate: new Date(futureDate),
    };

    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = testSeason;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    let currentSeason = await seasonsService.getCurrentSeason();

    expect(currentSeason.name).toEqual("Test Season");
    expect(currentSeason.id).toEqual(seasonId);
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
