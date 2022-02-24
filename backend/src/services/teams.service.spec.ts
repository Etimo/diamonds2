import { SlackService } from "./slack.service";
import { Repository } from "typeorm";
import { SeasonsEntity } from "../db/models/seasons.entity";
import { TestingModule, Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { TeamsService } from "./teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import ForbiddenError from "../errors/forbidden.error";
import { TeamDto } from "../models/team.dto";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";

describe("SeasonsService", () => {
  let teamsService: TeamsService;
  let repositoryMock: MockType<Repository<SeasonsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: getRepositoryToken(TeamsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    teamsService = module.get<TeamsService>(TeamsService);
    repositoryMock = module.get(getRepositoryToken(TeamsEntity));
    jest.clearAllMocks();
  });
  it("should be defined", () => {
    expect(TeamsService).toBeDefined();
  });

  it("add, should throw Forbidden error", async () => {
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: null,
    };

    await expect(teamsService.add(team)).rejects.toThrowError(ForbiddenError);
  });

  it("add, should throw Conflict error", async () => {
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "www.etimo.se",
    };

    const teamEntity: TeamsEntity = {
      ...team,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    spyOn<any>(teamsService, "exist").and.returnValue(teamEntity);

    await expect(teamsService.add(team)).rejects.toThrowError(ConflictError);
  });

  it("add, should return dto", async () => {
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "https://etimo.se",
    };

    const save = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = team;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);
    spyOn<any>(teamsService, "exist").and.returnValue(null);

    await expect(teamsService.add(team)).resolves.toHaveProperty("name");
  });

  it("add, should throw invalid url", async () => {
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "httpsasd",
    };

    const save = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = team;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);
    spyOn<any>(teamsService, "exist").and.returnValue(null);

    await expect(teamsService.add(team)).rejects.toThrowError(ForbiddenError);
  });

  it("getByAbbreviation, should return dto", async () => {
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "asd",
    };

    //Mocking find from seasonsService
    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = team;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    await expect(
      teamsService.getByAbbreviation(team.abbreviation),
    ).resolves.toHaveProperty("name");
  });

  it("getByAbbreviation, should throw not found error", async () => {
    //Mocking find from seasonsService
    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = null;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    await expect(teamsService.getByAbbreviation("test")).rejects.toThrow(
      NotFoundError,
    );
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
