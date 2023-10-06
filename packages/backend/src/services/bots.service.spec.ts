import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { BotRegistrationsRepository, TeamsRepository } from "../db";
import { ConflictError, NotFoundError } from "../errors";
import { BotRecoveryDto, BotRegistrationDto } from "../models";
import { IBot, ITeam } from "../types";
import { BotsService } from "./bots.service";
import { TeamsService } from "./teams.service";

describe("BotsService", () => {
  let botsService: BotsService;
  let teamsService: TeamsService;

  let repositoryMock = {
    getByEmail: jest.fn(),
    getByName: jest.fn(),
    create: jest.fn(),
  };

  let teamsRepositoryMock = {
    get: jest.fn(),
    create: jest.fn(),
    getByAbbreviation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,
        {
          provide: TeamsService,
          useValue: teamsService,
        },
        {
          provide: BotRegistrationsRepository,
          useValue: repositoryMock,
        },
        TeamsService,
        {
          provide: TeamsRepository,
          useValue: teamsRepositoryMock,
        },
      ],
    }).compile();

    botsService = module.get<BotsService>(BotsService);
    teamsService = module.get<TeamsService>(TeamsService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(botsService).toBeDefined();
    expect(teamsService).toBeDefined();
  });

  it("add, Adding bot with same email generates error", async () => {
    //arrange
    const data: BotRegistrationDto = {
      email: "hello@world.se",
      password: "123456",
      name: "bot1",
      team: "team1",
    };

    const dataRepoReturn: IBot = {
      email: data.email,
      password: data.password,
      name: "bot2",
      id: "1",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: null,
    };

    repositoryMock.getByEmail.mockReturnValue(dataRepoReturn);
    repositoryMock.getByName.mockReturnValue(dataRepoReturn);

    //act
    let response = botsService.add(data);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });

  it("add, Adding bot with same name generates error", async () => {
    //arrange
    const data: BotRegistrationDto = {
      email: "hello@world.se",
      password: "123456",
      name: "bot1",
      team: "team1",
    };

    const dataRepoReturn: IBot = {
      email: "hello@world2.se",
      password: data.password,
      name: data.name,
      id: "1",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: "team1",
    };

    repositoryMock.getByEmail.mockReturnValue(dataRepoReturn);
    repositoryMock.getByName.mockReturnValue(dataRepoReturn);

    //act
    let response = botsService.add(data);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });

  it("add, should add", async () => {
    //arrange
    let team = "team1";
    const data: BotRegistrationDto = {
      email: "hello@world.se",
      password: "123456",
      name: "bot1",
      team: team,
    };
    const dataRepoReturn: IBot = {
      email: "hello@world2.se",
      password: data.password,
      name: data.name,
      id: "1",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: null,
    };

    repositoryMock.getByEmail.mockReturnValue(undefined);
    repositoryMock.getByName.mockReturnValue(undefined);
    repositoryMock.create.mockReturnValue(dataRepoReturn);
    let iteam: ITeam = {
      id: "id",
      name: team,
      abbreviation: "t",
      logotypeUrl: "",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };
    teamsRepositoryMock.getByAbbreviation.mockReturnValue(iteam);

    //act
    let response = await botsService.add(data);

    //assert
    expect(response).toEqual(dataRepoReturn);
    expect(repositoryMock.create).toBeCalledTimes(1);
  });

  it("Get bot with email and password", async () => {
    //arrange
    const password = "123456";
    const hashedPassword = await bcrypt.hash(password, 10);
    const data: IBot = {
      email: "hel22lo@world.se",
      name: "bot122",
      password: hashedPassword,
      team: undefined,
      id: "1",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: null,
    };

    repositoryMock.getByEmail.mockReturnValue(data);

    const botRecoveryDto: BotRecoveryDto = {
      email: data.email,
      password: password,
    };

    //act
    const response = botsService.getByEmailAndPassword(botRecoveryDto);

    //assert
    expect(response).resolves.toHaveProperty("email");
  });

  it("Get bot with email and password, should fail - incorrect password", async () => {
    //arrange
    const password = "123456";
    const incorrectPassword = "1234567";
    const hashedPassword = await bcrypt.hash(password, 10);
    const data: IBot = {
      email: "hel22lo@world.se",
      name: "bot122",
      password: hashedPassword,
      team: undefined,
      id: "1",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
      teamId: null,
    };

    repositoryMock.getByEmail.mockReturnValue(data);

    const botRecoveryDto: BotRecoveryDto = {
      email: data.email,
      password: incorrectPassword,
    };

    //act
    const response = botsService.getByEmailAndPassword(botRecoveryDto);

    //assert
    expect(response).rejects.toThrow(NotFoundError);
  });

  it("Get bot with email and password, should fail - incorrect email", async () => {
    //arrange
    const password = "123456";
    const email = "hello@world.se";

    repositoryMock.getByEmail.mockReturnValue(undefined);

    const botRecoveryDto: BotRecoveryDto = {
      email: email,
      password: password,
    };

    //act
    const response = botsService.getByEmailAndPassword(botRecoveryDto);

    //assert
    expect(response).rejects.toThrow(NotFoundError);
  });
});
