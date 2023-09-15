import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { BotRegistrationsRepository } from "../db";
import { ConflictError, NotFoundError } from "../errors";
import { BotRecoveryDto, BotRegistrationDto } from "../models";
import { IBot, INewBot } from "../types";
import { TeamsService } from "./teams.service";

@Injectable()
export class BotsService {
  constructor(
    private teamsService: TeamsService,
    private repo: BotRegistrationsRepository,
  ) {}

  public async add(input: BotRegistrationDto): Promise<IBot> {
    if (
      (await this.repo.getByEmail(input.email)) ||
      (await this.repo.getByName(input.name))
    ) {
      return Promise.reject(
        new ConflictError("Email and/or name already exists"),
      );
    }

    const newBot: INewBot = {
      name: input.name,
      email: input.email,
      password: input.password,

      teamId: null,
    };

    // Fetching the teamId
    if (input.team) {
      const team = await this.teamsService.getByAbbreviation(input.team);
      if (!team) {
        throw new NotFoundError("Team not found");
      }
      newBot.teamId = team.id;
    }

    return this.create(newBot) as unknown as IBot;
  }

  public async get(id: string): Promise<IBot | null> {
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
