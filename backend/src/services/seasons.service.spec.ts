import { SeasonsService } from "./seasons.service";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { SeasonDto } from "../models/season.dto";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import { createTestingModule } from "../test-utils";
import { SeasonsRepository } from "../db/repositories/seasons.repository";

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

  // it("Should add season", async () => {
  //   const dto = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2018-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
  //   spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

  //   const save = jest.fn(
  //     () =>
  //       new Promise<SeasonDto>((resolve, reject) => {
  //         var savedPackage: SeasonDto = dto;

  //         setTimeout(() => {
  //           resolve(savedPackage);
  //         }, 500);
  //       }),
  //   );

  //   repositoryMock.save.mockImplementation(save);

  //   const season = await seasonsService.add(dto);
  //   expect(season.name).toEqual("test");
  // });

  // it("Adding season, fails with startDate larger then endDate", async () => {
  //   const dto = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2020-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
  //   spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

  //   const save = jest.fn(
  //     () =>
  //       new Promise<SeasonDto>((resolve, reject) => {
  //         var savedPackage: SeasonDto = dto;

  //         setTimeout(() => {
  //           resolve(savedPackage);
  //         }, 500);
  //       }),
  //   );

  //   repositoryMock.save.mockImplementation(save);

  //   await expect(seasonsService.add(dto)).rejects.toThrowError(ForbiddenError);
  // });

  // it("Adding season, fails with date collision", async () => {
  //   const dto = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2018-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   const collisionSeason = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2018-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   spyOn<any>(seasonsService, "nameExists").and.returnValue(false);
  //   spyOn<any>(seasonsService, "dateCollision").and.returnValue(
  //     collisionSeason,
  //   );

  //   const save = jest.fn(
  //     () =>
  //       new Promise<SeasonDto>((resolve, reject) => {
  //         var savedPackage: SeasonDto = dto;

  //         setTimeout(() => {
  //           resolve(savedPackage);
  //         }, 500);
  //       }),
  //   );

  //   repositoryMock.save.mockImplementation(save);

  //   await expect(seasonsService.add(dto)).rejects.toThrowError(ConflictError);
  // });

  // it("Adding season, fails with name exists", async () => {
  //   const dto = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2018-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   const nameExists = SeasonDto.create({
  //     name: "test",
  //     startDate: new Date("2018-01-01"),
  //     endDate: new Date("2018-02-01"),
  //   });

  //   spyOn<any>(seasonsService, "nameExists").and.returnValue(nameExists);
  //   spyOn<any>(seasonsService, "dateCollision").and.returnValue(false);

  //   const save = jest.fn(
  //     () =>
  //       new Promise<SeasonDto>((resolve, reject) => {
  //         var savedPackage: SeasonDto = dto;

  //         setTimeout(() => {
  //           resolve(savedPackage);
  //         }, 500);
  //       }),
  //   );

  //   repositoryMock.save.mockImplementation(save);

  //   await expect(seasonsService.add(dto)).rejects.toThrowError(ConflictError);
  // });
});
