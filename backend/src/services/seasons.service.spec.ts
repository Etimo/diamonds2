import { SeasonsService } from "./seasons.service";
import { TestingModule } from "@nestjs/testing";
import { createTestingModule } from "../test-utils";
import { SeasonsRepository } from "../db/repositories/seasons.repository";
import { SeasonDto } from "../models/season.dto";
import ForbiddenError from "../errors/forbidden.error";
import ConflictError from "../errors/conflict.error";

describe("SeasonsService", () => {
  let seasonsService: SeasonsService;
  let repositoryMock: SeasonsRepository;
  let seasonId = "c43eee94-f363-4097-85e2-db3b48ed2d79";

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule();
    seasonsService = module.get<SeasonsService>(SeasonsService);
    repositoryMock = module.get(SeasonsRepository);
    jest.clearAllMocks();
  });

  it("should get no items in list", async () => {
    spyOn(repositoryMock, "all").and.returnValue(
      new Promise(resolve => resolve([])),
    );

    const all = await seasonsService.all();

    expect(all.length).toEqual(0);
  });

  it("should get one item in list", async () => {
    const testSeason = {
      id: seasonId,
      name: "Test Season",
      startDate: new Date(),
      endDate: new Date(),
    };
    spyOn(repositoryMock, "all").and.returnValue(
      new Promise(resolve => resolve([testSeason])),
    );

    const all = await seasonsService.all();

    expect(all.length).toEqual(1);
  });

  it("should return season by id", async () => {
    const seasons = [
      {
        id: "1",
        name: "Season1",
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        id: "2",
        name: "Season2",
        startDate: new Date(),
        endDate: new Date(),
      },
    ];
    spyOn(repositoryMock, "getSeason").and.callFake(
      s => new Promise(resolve => resolve(seasons.find(ss => ss.id === s))),
    );

    const all = await seasonsService.getSeason("2");

    expect(all).toEqual(seasons[1]);
  });

  it("should add season", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2018-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn(repositoryMock, "nameExists").and.returnValue(false);
    spyOn(repositoryMock, "dateCollision").and.returnValue(false);
    spyOn(repositoryMock, "create").and.returnValue(dto);

    const season = await seasonsService.add(dto);
    expect(season.name).toEqual("test");
  });

  it("Adding season, fails with startDate larger then endDate", async () => {
    const dto = SeasonDto.create({
      name: "test",
      startDate: new Date("2020-01-01"),
      endDate: new Date("2018-02-01"),
    });

    spyOn(repositoryMock, "nameExists").and.returnValue(false);
    spyOn(repositoryMock, "dateCollision").and.returnValue(false);

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

    spyOn(repositoryMock, "nameExists").and.returnValue(false);
    spyOn(repositoryMock, "dateCollision").and.returnValue(collisionSeason);

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

    spyOn(repositoryMock, "nameExists").and.returnValue(nameExists);
    spyOn(repositoryMock, "dateCollision").and.returnValue(false);

    await expect(seasonsService.add(dto)).rejects.toThrowError(ConflictError);
  });
});
