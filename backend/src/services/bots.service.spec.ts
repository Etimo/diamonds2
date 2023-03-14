import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcrypt";
import { BotRegistrationsRepository } from "../db/repositories/botRegistrations.repository";
import { TeamsRepository } from "../db/repositories/teams.repository";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import { BotRegistrationDto } from "../models/bot-registration.dto";
import { IBot } from "../types";
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
      team: null,
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
      team: null,
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

    repositoryMock.getByEmail.mockReturnValue(dataRepoReturn);
    repositoryMock.getByName.mockReturnValue(dataRepoReturn);

    //act
    let response = botsService.add(data);

    //assert
    await expect(response).rejects.toThrowError(ConflictError);
  });

  it("add, should add", async () => {
    //arrange
    const data: BotRegistrationDto = {
      email: "hello@world.se",
      password: "123456",
      name: "bot1",
      team: null,
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
      team: null,
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
      team: null,
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

  // it("Add and get bot with team, throw not found error - Team does not exist", async () => {
  //   //arrange
  //   const password = "123456";
  //   const hashedPassword = await bcrypt.hash(password, 10);
  //   const data: IBot = {
  //     email: "hel22lo@world.se",
  //     name: "bot122",
  //     password: hashedPassword,
  //     id: "1",
  //     createTimeStamp: new Date(),
  //     updateTimeStamp: new Date(),
  //     teamId: "123",
  //   };
  //
  //   repositoryMock.getByEmail.mockReturnValue(data);
  //
  //   const botRecoveryDto: BotRecoveryDto = {
  //     email: data.email,
  //     password: password,
  //   };
  //
  //   //act
  //   const response = botsService.getByEmailAndPassword(botRecoveryDto);
  //
  //   //assert
  //   expect(response).rejects.toThrow(NotFoundError);
  // });
});

// describe("BotsService", () => {
//   let botsService: BotsService;
//   let repositoryMock: MockType<Repository<BotRegistrationsEntity>>;
//   let repositoryMock1: MockType<Repository<TeamsEntity>>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         BotsService,
//         {
//           // provide: getRepositoryToken(BotRegistrationsEntity),
//           useFactory: () => getRepositoryToken(BotRegistrationsEntity),
//           provide: "BOT_REGISTRATIONS",
//         },
//         TeamsService,
//         {
//           provide: "TEAMS",
//           useFactory: () => getRepositoryToken(TeamsEntity),
//         },
//       ],
//     }).compile();
//     botsService = module.get<BotsService>(BotsService);
//     repositoryMock =
//       module.get<MockType<Repository<BotRegistrationsEntity>>>(
//         "BOT_REGISTRATIONS",
//       ); //getRepositoryToken(BotRegistrationsEntity);
//     repositoryMock1 =
//       module.get<MockType<Repository<BotRegistrationsEntity>>>("TEAMS");
//     jest.clearAllMocks();
//   });

//   it("Add password should fail, incorrect token", async () => {
//     const data = {
//       email: "hel22lo@world.se",
//       botName: "bot122",
//       password: "123456",
//     };

//     const getOne = jest.fn(
//       () =>
//         new Promise<BotRegistrationDto>((resolve, reject) => {
//           var savedPackage: BotRegistrationDto = null;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );
//     const where2 = jest.fn(() => ({ getOne }));

//     repositoryMock.createQueryBuilder.mockImplementation(
//       jest.fn(() => ({ where: where2 })),
//     );

//     const botPasswordDto: BotPasswordDto = {
//       token: "asd",
//       password: "123456",
//     };
//     await expect(
//       botsService.addPassword(botPasswordDto),
//     ).rejects.toBeInstanceOf(NotFoundError);
//   });

//   it("Add password should fail, password already exist", async () => {
//     const data = {
//       email: "hel22lo@world.se",
//       botName: "bot122",
//       password: "123456",
//       team: null,
//     };
//     const getOne = jest.fn(
//       () =>
//         new Promise<BotRegistrationDto>((resolve, reject) => {
//           var savedPackage: BotRegistrationDto = data;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );
//     const where2 = jest.fn(() => ({ getOne }));

//     repositoryMock.createQueryBuilder.mockImplementation(
//       jest.fn(() => ({ where: where2 })),
//     );

//     const botPasswordDto: BotPasswordDto = {
//       token: "test@test.se",
//       password: "123456",
//     };
//     await expect(
//       botsService.addPassword(botPasswordDto),
//     ).rejects.toBeInstanceOf(ForbiddenError);
//   });

//   it("Add and get bot with team", async () => {
//     const data = {
//       email: "hel22lo@world.se",
//       botName: "bot122",
//       password: "123456",
//       team: "etimo",
//     };

//     const team = {
//       id: "123123",
//       abbreviation: "etimo",
//       name: "Etimo",
//       logotypeUrl: "asdasd",
//     };

//     const save = jest.fn(
//       () =>
//         new Promise<BotRegistrationDto>((resolve, reject) => {
//           var savedPackage: BotRegistrationDto = data;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );

//     let getOne = jest.fn(
//       () =>
//         new Promise<TeamDto>((resolve, reject) => {
//           var savedPackage: TeamDto = team;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );

//     let where = jest.fn(() => ({ getOne }));

//     repositoryMock1.createQueryBuilder.mockImplementation(
//       jest.fn(() => ({ where: where })),
//     );

//     repositoryMock.save.mockImplementation(save);

//     const result: BotRegistrationPublicDto = await botsService.add(data);

//     const getOne2 = jest.fn(
//       () =>
//         new Promise<BotRegistrationDto>((resolve, reject) => {
//           var savedPackage: BotRegistrationDto = data;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );

//     const where2 = jest.fn(() => ({ getOne: getOne2 }));

//     repositoryMock.createQueryBuilder.mockImplementation(
//       jest.fn(() => ({ where: where2 })),
//     );

//     await expect(botsService.get(result.token)).resolves.toHaveProperty(
//       "email",
//     );
//   });

//   it("Add and get bot with team, throw not found error - Team does not exist", async () => {
//     const data = {
//       email: "hel22lo@world.se",
//       botName: "bot122",
//       password: "123456",
//       team: "zxczxc",
//     };

//     const save = jest.fn(
//       () =>
//         new Promise<BotRegistrationDto>((resolve, reject) => {
//           var savedPackage: BotRegistrationDto = data;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );

//     let getOne = jest.fn(
//       () =>
//         new Promise<TeamDto>((resolve, reject) => {
//           var savedPackage: TeamDto = null;

//           setTimeout(() => {
//             resolve(savedPackage);
//           }, 500);
//         }),
//     );

//     let where = jest.fn(() => ({ getOne }));

//     repositoryMock1.createQueryBuilder.mockImplementation(
//       jest.fn(() => ({ where: where })),
//     );

//     repositoryMock.save.mockImplementation(save);

//     await expect(botsService.add(data)).rejects.toThrow(NotFoundError);
//   });
// });

// // @ts-ignore
// export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
//   () => ({
//     findOne: jest.fn((entity) => entity),
//     find: jest.fn((entity) => entity),
//     update: jest.fn(),
//     save: jest.fn(),
//     createQueryBuilder: jest.fn(() => ({
//       where: jest.fn(() => ({ getOne: jest.fn((entity) => entity) })),
//       getOne: jest.fn(),
//     })),
//     execute: jest.fn((entity) => entity),
//     where: jest.fn(),
//   }),
// );
// export type MockType<T> = {
//   [P in keyof T]: jest.Mock<{}>;
// };
