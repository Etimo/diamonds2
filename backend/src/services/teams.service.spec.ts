import { TestingModule } from "@nestjs/testing";
import { TeamsService } from "./teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import ForbiddenError from "../errors/forbidden.error";
import { TeamDto } from "../models/team.dto";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { TeamsRepository } from "../db/repositories/teams.repository";
import { createTestingModule } from "../test-utils";

describe("SeasonsService", () => {
  let teamsService: TeamsService;
  let teamsRepositoryMock: TeamsRepository;

  const team = {
    id: "123",
    abbreviation: "etimo",
    name: "Etimo",
    logotypeUrl: "https://etimo.se",
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule();
    teamsService = module.get(TeamsService);
    teamsRepositoryMock = module.get(TeamsRepository);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("add", () => {
    it("should throw Forbidden error is missing logotype", async () => {
      await expect(
        teamsService.add({
          ...team,
          logotypeUrl: null,
        }),
      ).rejects.toThrowError(ForbiddenError);
    });

    it("should throw Conflict error", async () => {
      const teamEntity: TeamsEntity = {
        ...team,
        createTimeStamp: new Date(),
        updateTimeStamp: new Date(),
      };

      spyOn(teamsRepositoryMock, "exist").and.returnValue(teamEntity);

      await expect(teamsService.add(team)).rejects.toThrowError(ConflictError);
    });

    it("should return dto", async () => {
      spyOn(teamsRepositoryMock, "exist").and.returnValue(null);
      spyOn(teamsRepositoryMock, "create").and.returnValue(team);

      await expect(teamsService.add(team)).resolves.toEqual(team);
    });

    it("should throw invalid url", async () => {
      const team = {
        id: "123",
        abbreviation: "etimo",
        name: "Etimo",
        logotypeUrl: "httpsasd",
      };

      spyOn(teamsRepositoryMock, "exist").and.returnValue(null);

      await expect(teamsService.add(team)).rejects.toThrowError(ForbiddenError);
    });
  });

  describe("getByAbbreviation", () => {
    it("should return dto", async () => {
      spyOn(teamsRepositoryMock, "getByAbbreviation").and.returnValue(team);

      await expect(
        teamsService.getByAbbreviation(team.abbreviation),
      ).resolves.toBeInstanceOf(TeamDto);
    });

    it("should throw not found error", async () => {
      spyOn(teamsRepositoryMock, "getByAbbreviation").and.returnValue(null);

      await expect(teamsService.getByAbbreviation("test")).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
