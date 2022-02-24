import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import * as bcrypt from "bcrypt";
import NotFoundError from "../errors/not-found.error";
import { BotPasswordDto } from "../models/bot-password.dto";
import ForbiddenError from "../errors/forbidden.error";
import { TeamsService } from "./teams.service";
import { BotsRepository } from "../db/repositories/bots.repository";

@Injectable()
export class BotsService {
  constructor(
    private readonly repo: BotsRepository,
    private teamsService: TeamsService,
  ) {}

  public async add(
    input: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    if (
      (await this.emailExists(input.email)) ||
      (await this.nameExists(input.botName))
    ) {
      throw new ConflictError("Email and/or name already exists");
    }

    // Fetching the teamId
    if (input.team) {
      const team = await this.teamsService.getByAbbreviation(input.team);
      input.team = team.id;
    }

    return this.create(input);
  }

  public async get(token: string): Promise<BotRegistrationPublicDto> {
    return BotRegistrationPublicDto.fromEntity(
      await this.repo.getByToken(token),
    );
  }

  private async emailExists(email: string) {
    email = email.toLowerCase();

    const existEmail = await this.repo.getByEmail(email);
    return existEmail;
  }

  private async nameExists(name: string) {
    name = name.toLowerCase();
    const existName = await this.repo.getByName(name);
    return existName;
  }

  public async create(
    dto: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    // Hashing password
    dto.password = await this.hashPassword(dto.password);
    return BotRegistrationPublicDto.fromEntity(await this.repo.create(dto));
  }

  public async delete(dto: BotRegistrationDto) {
    return this.repo.deleteByName(dto.botName);
  }

  public async getByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<BotRegistrationPublicDto> {
    const existBot = await this.repo.getByEmail(email);

    // Don't return bots with no password
    if (existBot && existBot.password) {
      // Return bot if password is correct
      if (await bcrypt.compare(password, existBot.password)) {
        return BotRegistrationPublicDto.fromEntity(existBot);
      }
    }
    throw new NotFoundError("Invalid email or password");
  }

  public async addPassword(
    botPasswordDto: BotPasswordDto,
  ): Promise<BotRegistrationPublicDto> {
    const existBot = await this.repo.getByToken(botPasswordDto.token);

    if (!existBot) {
      throw new NotFoundError("Bot not found");
    }

    if (existBot.password) {
      throw new ForbiddenError("Bot already has a password");
    }

    const hashedPassword = await this.hashPassword(botPasswordDto.password);
    await this.repo.setPassword(botPasswordDto.token, hashedPassword);

    return BotRegistrationPublicDto.fromEntity(existBot);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
