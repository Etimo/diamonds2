import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import { TeamsRepository } from "../db/repositories/teams.repository";
import { ConflictError, ForbiddenError } from "../errors";
import { ITeam } from "../types";
import { TeamsService } from "./teams.service";

describe("TeamsService", () => {
  let teamsService: TeamsService;

  let repositoryMock = {
    get: jest.fn(),
    create: jest.fn(),
    getByAbbreviation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamsService,
        {
          provide: TeamsRepository,
          useValue: repositoryMock,
        },
      ],
    }).compile();

    teamsService = module.get<TeamsService>(TeamsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(TeamsService).toBeDefined();
  });

  it("add, should throw Forbidden error", async () => {
    //arrange
    const team: ITeam = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    //act
    let response = teamsService.add(team);

    //arrange
    await expect(response).rejects.toThrowError(ForbiddenError);
  });

  it("add, should throw Conflict error", async () => {
    //arrange
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "www.etimo.se",
    };
    const teamEntity: ITeam = {
      ...team,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };
    repositoryMock.get.mockReturnValue(teamEntity);

    //act
    let response = teamsService.add(team);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });

  it("add, should return ITeam", async () => {
    //arrange
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "https://etimo.se",
    };
    const teamEntity: ITeam = {
      ...team,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.get.mockReturnValue(null);

    const save = jest.fn(
      () =>
        new Promise<ITeam>((resolve, reject) => {
          var savedPackage: ITeam = teamEntity;
          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.create.mockImplementation(save);

    //act
    let response = teamsService.add(team);

    //assert
    await expect(response).resolves.toHaveProperty("name");
  });

  it("add, should throw invalid url", async () => {
    //arrange
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "httpsasd",
    };
    const teamEntity: ITeam = {
      ...team,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    const save = jest.fn(
      () =>
        new Promise<ITeam>((resolve, reject) => {
          var savedPackage: ITeam = teamEntity;
          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    repositoryMock.create.mockImplementation(save);
    repositoryMock.get.mockReturnValue(null);

    //act
    let response = teamsService.add(team);

    //assert
    await expect(response).rejects.toThrowError(ForbiddenError);
  });

  it("getByAbbreviation, should return ITeam", async () => {
    //arrange
    const team = {
      id: "123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "asd",
    };
    const teamEntity: ITeam = {
      ...team,
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    repositoryMock.getByAbbreviation.mockReturnValue(teamEntity);

    //act
    let response = teamsService.getByAbbreviation(team.abbreviation);

    //assert
    await expect(response).resolves.toHaveProperty("name");
  });
});
