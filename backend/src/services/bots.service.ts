import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotRegistrationsRepository } from "../db/repositories/botRegistrations.repository";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import { IBot, INewBot } from "../types";
import { TeamsService } from "./teams.service";

@Injectable()
export class BotsService {
  constructor(
    private teamsService: TeamsService,
    private repo: BotRegistrationsRepository,
  ) {}

  public async add(input: BotRegistrationDto) {
    if (
      (await this.repo.getByEmail(input.email)) ||
      (await this.repo.getByName(input.name))
    ) {
      return Promise.reject(
        new ConflictError("Email and/or name already exists"),
      );
    }

    const newBot: INewBot = {
      ...input,
      teamId: null,
    };

    // Fetching the teamId
    if (input.team) {
      const team = await this.teamsService.getByAbbreviation(input.team);
      newBot.teamId = team.id;
    }

    return this.create(newBot);
  }

  public async get(id: string) {
    return this.repo.get(id);
  }

  public async create(dto: INewBot) {
    // Hashing password
    dto.password = await this.hashPassword(dto.password);

    return this.repo.create(dto);
  }

  public async delete(dto: IBot) {
    return this.repo.delete(dto);
  }

  public async getByEmailAndPassword(botRecoveryDto: BotRecoveryDto) {
    const existingBot = await this.repo.getByEmail(botRecoveryDto.email);

    // Don't return bots with no password
    if (existingBot && existingBot.password) {
      // Return bot if password is correct
      if (await bcrypt.compare(botRecoveryDto.password, existingBot.password)) {
        return existingBot;
      }
    }
    throw new NotFoundError("Invalid email or password");
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
