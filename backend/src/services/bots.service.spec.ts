import { BotsService } from "./bots.service";
import ConflictError from "../errors/conflict.error";
import { TestingModule } from "@nestjs/testing";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import NotFoundError from "../errors/not-found.error";
import * as bcrypt from "bcrypt";
import ForbiddenError from "../errors/forbidden.error";
import { createTestingModule } from "../test-utils";
import { BotsRepository } from "../db/repositories/bots.repository";

describe("BotsService", () => {
  let botsService: BotsService;
  let botsRepositoryMock: BotsRepository;
  const bot = {
    email: "hello@world.se",
    botName: "bot1",
    password: "123456",
    team: null,
    token: "token",
  };

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule();
    botsService = module.get<BotsService>(BotsService);
    botsRepositoryMock = module.get(BotsRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("adding bot with same email generates error", async () => {
    spyOn(botsRepositoryMock, "getByEmail").and.returnValue(bot);

    return expect(
      botsService.add({
        email: bot.email,
        botName: "other bot",
        password: "123456",
        team: "liu",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("adding bot with same name generates error", async () => {
    spyOn(botsRepositoryMock, "getByName").and.returnValue(bot);

    return expect(
      botsService.add({
        email: bot.email,
        botName: "other bot",
        password: "123456",
        team: "liu",
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });

  it("get by token", async () => {
    spyOn(botsRepositoryMock, "getByToken").and.returnValue(bot);

    return expect(botsService.get(bot.token)).resolves.toBeInstanceOf(
      BotRegistrationPublicDto,
    );
  });

  describe("get by email and password", () => {
    it("should succeed", async () => {
      spyOn(botsRepositoryMock, "getByEmail").and.returnValue({
        ...bot,
        password: await bcrypt.hash(bot.password, 10),
      });

      return expect(
        botsService.getByEmailAndPassword(bot.email, bot.password),
      ).resolves.toBeInstanceOf(BotRegistrationPublicDto);
    });

    it("should fail if invalid password", async () => {
      spyOn(botsRepositoryMock, "getByEmail").and.returnValue({
        ...bot,
        password: await bcrypt.hash("other", 10),
      });

      return expect(
        botsService.getByEmailAndPassword(bot.email, bot.password),
      ).rejects.toThrowError(NotFoundError);
    });

    it("should fail if invalid email", async () => {
      spyOn(botsRepositoryMock, "getByEmail").and.returnValue(null);

      return expect(
        botsService.getByEmailAndPassword(bot.email, bot.password),
      ).rejects.toThrowError(NotFoundError);
    });
  });

  describe("add password", () => {
    it("should fail if not found", async () => {
      spyOn(botsRepositoryMock, "getByToken").and.returnValue(null);

      return expect(botsService.addPassword(bot)).rejects.toThrowError(
        NotFoundError,
      );
    });

    it("should fail if already has password", async () => {
      spyOn(botsRepositoryMock, "getByToken").and.returnValue(bot);

      return expect(botsService.addPassword(bot)).rejects.toThrowError(
        ForbiddenError,
      );
    });

    it("should succeed", async () => {
      spyOn(botsRepositoryMock, "getByToken").and.returnValue({
        ...bot,
        password: undefined,
      });

      const res = await botsService.addPassword(bot);

      expect(res).toBeInstanceOf(BotRegistrationPublicDto);
    });
  });
});
