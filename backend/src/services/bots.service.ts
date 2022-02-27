import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { MetricsService } from "./metrics.service";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import * as bcrypt from "bcrypt";
import NotFoundError from "../errors/not-found.error";
import { BotPasswordDto } from "../models/bot-password.dto";
import ForbiddenError from "../errors/forbidden.error";
import { TeamsService } from "./teams.service";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    @InjectRepository(BotRegistrationsEntity)
    private readonly repo: Repository<BotRegistrationsEntity>,
    private metricsService: MetricsService,
    private teamsService: TeamsService,
  ) {}

  public async add(
    input: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    if (
      (await this.emailExists(input.email)) ||
      (await this.nameExists(input.botName))
    ) {
      return Promise.reject(
        new ConflictError("Email and/or name already exists"),
      );
    }

    // Fetching the teamId
    if (input.team) {
      const team = await this.teamsService.getByAbbreviation(input.team);
      input.team = team.id;
    }

    if (this.metricsService) {
      this.metricsService.incBotsRegistered();
    }

    return this.create(input);
  }

  public async get(token: string): Promise<BotRegistrationPublicDto> {
    const existBot = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.token = :token", { token: token })
      .getOne()
      .then(botRegistrationsEntity =>
        BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
      );
    return existBot;
  }

  private async emailExists(email: string) {
    email = email.toLowerCase();

    const existEmail = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.email = :email", { email: email })
      .getOne();
    //    console.log(!existEmail);
    return existEmail;
  }

  private async nameExists(name: string) {
    name = name.toLowerCase();
    const existName = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.botName = :botName", { botName: name })
      .getOne();
    //console.log(!firstUser);
    return existName;
  }

  public async create(
    dto: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    // Hashing password
    dto.password = await this.hashPassword(dto.password);
    return await this.repo
      .save(dto)
      .then(botRegistrationsEntity =>
        BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
      );
  }

  public async delete(dto: BotRegistrationDto) {
    return await this.repo
      .createQueryBuilder()
      .delete()
      .from("bot_registrations")
      .where("botName = :botName", { botName: dto.botName })
      .execute();
  }

  public async getByEmailAndPassword(
    botRecoveryDto: BotRecoveryDto,
  ): Promise<BotRegistrationPublicDto> {
    const existBot = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.email = :email", {
        email: botRecoveryDto.email,
      })
      .getOne();

    // Don't return bots with no password
    if (existBot && existBot.password) {
      // Return bot if password is correct
      if (await bcrypt.compare(botRecoveryDto.password, existBot.password)) {
        return BotRegistrationPublicDto.fromEntity(existBot);
      }
    }
    return Promise.reject(new NotFoundError("Invalid email or password"));
  }

  public async addPassword(
    botPasswordDto: BotPasswordDto,
  ): Promise<BotRegistrationPublicDto> {
    const existBot = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.token = :token", {
        token: botPasswordDto.token,
      })
      .getOne();
    if (!existBot) {
      return Promise.reject(new NotFoundError("Bot not found"));
    }

    if (existBot.password) {
      return Promise.reject(new ForbiddenError("Bot already has a password"));
    }
    const hashedPassword = await this.hashPassword(botPasswordDto.password);
    await this.repo
      .createQueryBuilder()
      .update("bot_registrations")
      .set({ password: hashedPassword })
      .where("token = :token", {
        token: botPasswordDto.token,
      })
      .execute();

    return BotRegistrationPublicDto.fromEntity(existBot);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
