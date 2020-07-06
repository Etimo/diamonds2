import { SeasonsService } from "./seasons.service";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonDto } from "../models/season.dto";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";

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

  it("should get no items in list", async () => {
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

    expect(all.length).toEqual(0);
  });

  it("should get one item in list", async () => {
    let testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(),
      endDate: new Date(),
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

    expect(all.length).toEqual(1);
  });

  it("should get off season, exists no other seasons", async () => {
    const offSeason = {
      id: seasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };

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

    // Mock getOffSeason
    const getOffSeason = (SeasonsService.prototype.getOffSeason = jest.fn());
    getOffSeason.mockReturnValue(offSeason);

    let currentSeason = await seasonsService.getCurrentSeason();

    expect(currentSeason.name).toEqual("Off Season");
  });

  it("should return Test Season", async () => {
    let testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(),
      endDate: new Date(),
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

  it("Should add season", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
    spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

    const save = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = dto;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    const season = await seasonsService.add(dto);
    expect(season.name).toEqual("test");
  });

  it("Adding season, fails with startDate larger then endDate", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
    spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

    const save = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = dto;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    await expect(seasonsService.add(dto)).rejects.toThrowError(ForbiddenError);
  });

  it("Adding season, fails with date collision", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    const collisionSeason = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
    spyOn<any>(seasonsService, "dateCollision").and.returnValue(
      collisionSeason,
    );

    const save = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = dto;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    await expect(seasonsService.add(dto)).rejects.toThrowError(ConflictError);
  });

  it("Adding season, fails with name exists", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    const nameExists = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn<any>(seasonsService, "nameExists").and.returnValue(nameExists);
    spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

    const save = jest.fn(
      () =>
        new Promise<SeasonDto>((resolve, reject) => {
          var savedPackage: SeasonDto = dto;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    await expect(seasonsService.add(dto)).rejects.toThrowError(ConflictError);
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
