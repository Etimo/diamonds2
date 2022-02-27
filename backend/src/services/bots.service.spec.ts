import { BotsService } from "./bots.service";
import { Repository, SelectQueryBuilder, Connection } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { MetricsService } from "./metrics.service";
import NotFoundError from "../errors/not-found.error";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import * as bcrypt from "bcrypt";
import { BotPasswordDto } from "../models/bot-password.dto";
import ForbiddenError from "../errors/forbidden.error";
import { TeamsService } from "./teams.service";
import { TeamsEntity } from "../db/models/teams.entity";
import { TeamDto } from "../models/team.dto";

describe("BotsService", () => {
  let botsService: BotsService;
  let repositoryMock: MockType<Repository<BotRegistrationsEntity>>;
  let repositoryMock1: MockType<Repository<TeamsEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: MetricsService,
          useValue: null,
        },
        BotsService,
        {
          provide: getRepositoryToken(BotRegistrationsEntity),
          useFactory: repositoryMockFactory,
        },
        TeamsService,
        {
          provide: getRepositoryToken(TeamsEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    botsService = module.get<BotsService>(BotsService);
    repositoryMock = module.get(getRepositoryToken(BotRegistrationsEntity));
    repositoryMock1 = module.get(getRepositoryToken(TeamsEntity));
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(botsService).toBeDefined();
  });

  it("Adding bot with same email generates error", async () => {
    const data = {
      email: "hello@world.se",
      botName: "bot1",
      password: "123456",
      team: null,
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
        password: "123456",
        team: "liu",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(save).toHaveBeenCalledTimes(1);
  });

  it("Adding bot with same name generates error", async () => {
    const data = {
      email: "hello@world.se",
      botName: "bot1",
      password: "123456",
      team: null,
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
        password: "123456",
        team: "liu",
      }),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(save).toHaveBeenCalledTimes(1);
  });

  it("Get bot with token", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: null,
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

  it("Get bot with email and password", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: null,
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;
          savedPackage.password = hashedPassword;

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
          savedPackage.password = hashedPassword;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    const botRecoveryDto: BotRecoveryDto = {
      email: data.email,
      password: "123456",
    };
    await expect(
      botsService.getByEmailAndPassword(botRecoveryDto),
    ).resolves.toHaveProperty("email");
  });

  it("Get bot with email and password, should fail - incorrect password", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: null,
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;
          savedPackage.password = hashedPassword;

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
          savedPackage.password = hashedPassword;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    const botRecoveryDto: BotRecoveryDto = {
      email: data.email,
      password: "123",
    };
    await expect(
      botsService.getByEmailAndPassword(botRecoveryDto),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("Get bot with email and password, should fail - incorrect email", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: null,
    };
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const save = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;
          savedPackage.password = hashedPassword;

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
          savedPackage.password = hashedPassword;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    const botRecoveryDto: BotRecoveryDto = {
      email: "test@test.se",
      password: data.password,
    };
    await expect(
      botsService.getByEmailAndPassword(botRecoveryDto),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("Add password should fail, incorrect token", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
    };

    const getOne = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = null;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    const botPasswordDto: BotPasswordDto = {
      token: "asd",
      password: "123456",
    };
    await expect(
      botsService.addPassword(botPasswordDto),
    ).rejects.toBeInstanceOf(NotFoundError);
  });

  it("Add password should fail, password already exist", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: null,
    };
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

    const botPasswordDto: BotPasswordDto = {
      token: "test@test.se",
      password: "123456",
    };
    await expect(
      botsService.addPassword(botPasswordDto),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("Add password should return bot", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: null,
      token: "123",
      team: "liu",
      createTimeStamp: new Date(),
      updateTimeStamp: new Date(),
    };

    const execute = jest.fn();
    const where = jest.fn(() => ({ execute }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));

    const getOne = jest.fn(
      () =>
        new Promise<BotRegistrationsEntity>((resolve, reject) => {
          var savedPackage: BotRegistrationsEntity = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );
    const where2 = jest.fn(() => ({ getOne }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ update: update, where: where2 })),
    );

    const botPasswordDto: BotPasswordDto = {
      token: "test@test.se",
      password: "123456",
    };
    await expect(
      botsService.addPassword(botPasswordDto),
    ).resolves.toBeInstanceOf(BotRegistrationPublicDto);
  });

  it("Add and get bot with team", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: "etimo",
    };

    const team = {
      id: "123123",
      abbreviation: "etimo",
      name: "Etimo",
      logotypeUrl: "asdasd",
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

    let getOne = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = team;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    let where = jest.fn(() => ({ getOne }));

    repositoryMock1.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where })),
    );

    repositoryMock.save.mockImplementation(save);

    const result: BotRegistrationPublicDto = await botsService.add(data);

    const getOne2 = jest.fn(
      () =>
        new Promise<BotRegistrationDto>((resolve, reject) => {
          var savedPackage: BotRegistrationDto = data;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    const where2 = jest.fn(() => ({ getOne: getOne2 }));

    repositoryMock.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where2 })),
    );

    await expect(botsService.get(result.token)).resolves.toHaveProperty(
      "email",
    );
  });

  it("Add and get bot with team, throw not found error - Team does not exist", async () => {
    const data = {
      email: "hel22lo@world.se",
      botName: "bot122",
      password: "123456",
      team: "zxczxc",
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

    let getOne = jest.fn(
      () =>
        new Promise<TeamDto>((resolve, reject) => {
          var savedPackage: TeamDto = null;

          setTimeout(() => {
            resolve(savedPackage);
          }, 500);
        }),
    );

    let where = jest.fn(() => ({ getOne }));

    repositoryMock1.createQueryBuilder.mockImplementation(
      jest.fn(() => ({ where: where })),
    );

    repositoryMock.save.mockImplementation(save);

    await expect(botsService.add(data)).rejects.toThrow(NotFoundError);
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
