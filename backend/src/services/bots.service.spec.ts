import { BotsService } from "./bots.service";
import { Repository, SelectQueryBuilder, Connection } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";

describe("BotsService", () => {
  let botsService: BotsService;
  let repositoryMock: MockType<Repository<BotRegistrationsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotsService,

        {
          provide: getRepositoryToken(BotRegistrationsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    botsService = module.get<BotsService>(BotsService);
    repositoryMock = module.get(getRepositoryToken(BotRegistrationsEntity));
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(botsService).toBeDefined();
  });

  it("Adding bot with same email generates error", async () => {
    const data = {
      email: "hello@world.se",
      botName: "bot1",
    };

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    await botsService.add(data);

    expect(save).toHaveBeenCalledWith(data);
    expect(save).toHaveBeenCalledTimes(1);

    const getOne = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

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
      botsService.add({
        email: data.email,
        botName: "other bot",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(save).toHaveBeenCalledTimes(1);
  });

  it("Adding bot with same name generates error", async () => {
    const data = {
      email: "hello@world.se",
      botName: "bot1",
    };

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    await botsService.add(data);

    expect(save).toHaveBeenCalledWith(data);
    expect(save).toHaveBeenCalledTimes(1);

    const getOne = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

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
      botsService.add({
        email: "other@world.se",
        botName: data.botName,
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(save).toHaveBeenCalledTimes(1);
  });

  it("Get bot with token", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
    };

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    repositoryMock.save.mockImplementation(save);

    const result: BotRegistrationPublicDto = await botsService.add(data);

    const getOne = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    await expect(botsService.get(result.token)).resolves.toHaveProperty(
      "email",
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
