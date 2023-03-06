import { Test, TestingModule } from "@nestjs/testing";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { INewSeason, ISeason } from "../types";
import { offSeasonId } from "../utils/slack/utils";
import { SeasonsService } from "./seasons.service";

describe("SeasonsService", () => {
  let seasonsService: SeasonsService;
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";

  let repositoryMock = {
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
        SeasonsService,
        {
          provide: SeasonsRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    seasonsService = module.get<SeasonsService>(SeasonsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(seasonsService).toBeDefined();
  });

  it("getOffSeason, should return off season", async () => {
    // arrange
    const mockSeaason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };
    repositoryMock.getById.mockReturnValue(mockSeaason);

    // act
    let returnedValue = await seasonsService.getOffSeason();

    // assert
    expect(returnedValue.name).toEqual("Off Season");
  });

  it("all, should get no items in list", async () => {
    //arrange
    repositoryMock.getAll.mockReturnValue(
      new Promise<ISeason[]>((resolve, reject) => {
        var savedPackage: ISeason[] = [];
        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    //act
    let all = await seasonsService.all();

    //assert
    expect(all.length).toEqual(0);
  });

  it("all, should get one item in list", async () => {
    //arrange
    let testSeason: ISeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(),
      endDate: new Date(),
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      boardConfigId: "123",
    };

    repositoryMock.getAll.mockReturnValue(
      new Promise<ISeason[]>((resolve, reject) => {
        var savedPackage: ISeason[] = [testSeason];
        setTimeout(() => {
          resolve(savedPackage);
        }, 1500);
      }),
    );

    //act
    let all = await seasonsService.all();

    //assert
    expect(all.length).toEqual(1);
  });

  it("getCurrentSeason, should get off season when no other seasons exists", async () => {
    const offSeason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };

    //arrange
    repositoryMock.getCurrentSeason.mockReturnValue(undefined);
    const mockSeaason = {
      id: offSeasonId,
      name: "Off Season",
      startDate: new Date(),
      endDate: new Date(),
    };
    repositoryMock.getById.mockReturnValue(mockSeaason);

    //act
    let currentSeason = await seasonsService.getCurrentSeason();

    //assert
    expect(currentSeason.name).toEqual("Off Season");
  });

  it("getCurrentSeason, should return Test Season", async () => {
    let testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(),
      endDate: new Date(),
    };
    //arrange
    repositoryMock.getCurrentSeason.mockReturnValue(testSeason);

    //act
    let currentSeason = await seasonsService.getCurrentSeason();

    //assert
    expect(currentSeason.name).toEqual("Test Season");
    expect(currentSeason.id).toEqual(seasonId);
  });

  it("add, Should add season", async () => {
    //arrange
    const dto: INewSeason = {
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
    };
    repositoryMock.dateCollision.mockReturnValue(undefined);
    repositoryMock.getByName.mockReturnValue(undefined);

    repositoryMock.create.mockReturnValue(
      new Promise<ISeason>((resolve, reject) => {
        var savedPackage: ISeason = {
          ...dto,
          id: "124",
          createTimeStamp: new Date(),
          updateTimeStamp: new Date(),
        };
        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
    );

    //act
    const season = await seasonsService.add(dto);

    //assert
    expect(season.name).toEqual("test");
    expect(season.id).toEqual("124");
  });

  it("Adding season, fails with startDate larger then endDate", async () => {
    //arrange
    const dto: INewSeason = {
      name: "test",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
    };

    repositoryMock.dateCollision.mockReturnValue(undefined);
    repositoryMock.getByName.mockReturnValue(undefined);

    repositoryMock.create.mockReturnValue(
      new Promise<ISeason>((resolve, reject) => {
        var savedPackage: ISeason = {
          ...dto,
          id: "124",
          createTimeStamp: new Date(),
          updateTimeStamp: new Date(),
        };
        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
    );

    //act
    let response = seasonsService.add(dto);

    //assert
    await expect(response).rejects.toThrowError(ForbiddenError);
  });

  it("add, fails with date collision", async () => {
    //arrange
    const dto: INewSeason = {
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
    };

    const collisionSeason: ISeason = {
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
      id: "123",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.dateCollision.mockReturnValue(collisionSeason);
    repositoryMock.getByName.mockReturnValue(undefined);

    repositoryMock.create.mockReturnValue(
      new Promise<ISeason>((resolve, reject) => {
        var savedPackage: ISeason = {
          ...dto,
          id: "124",
          createTimeStamp: new Date(),
          updateTimeStamp: new Date(),
        };
        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
    );

    //act
    let response = seasonsService.add(dto);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });

  it("Adding season, fails with name exists", async () => {
    //arrange
    const dto: INewSeason = {
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
    };
    const nameExists: ISeason = {
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
      boardConfigId: "123",
      id: "123",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.dateCollision.mockReturnValue(undefined);
    repositoryMock.getByName.mockReturnValue(nameExists);
    repositoryMock.create.mockReturnValue(
      new Promise<ISeason>((resolve, reject) => {
        var savedPackage: ISeason = {
          ...dto,
          id: "124",
          createTimeStamp: new Date(),
          updateTimeStamp: new Date(),
        };
        setTimeout(() => {
          resolve(savedPackage);
        }, 500);
      }),
    );

    //act
    let response = seasonsService.add(dto);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });
});
