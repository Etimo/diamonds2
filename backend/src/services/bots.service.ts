import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import NotFoundError from "../errors/not-found.error";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import { INewBot } from "../types";
import { PrismaService } from "./prisma.service";
import { TeamsService } from "./teams.service";

@Injectable()
export class BotsService {
  constructor(
    private prisma: PrismaService,
    private teamsService: TeamsService,
  ) {}

  public async add(input: BotRegistrationDto) {
    if (
      (await this.emailExists(input.email)) ||
      (await this.nameExists(input.name))
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
    return this.prisma.bot.findFirst({
      where: {
        id,
      },
    });
  }

  private async emailExists(email: string) {
    email = email.toLowerCase();

    return this.prisma.bot.findFirst({
      where: {
        email,
      },
    });
  }

  private async nameExists(name: string) {
    name = name.toLowerCase();
    return this.prisma.bot.findFirst({
      where: {
        name,
      },
    });
  }

  public async create(dto: INewBot) {
    // Hashing password
    dto.password = await this.hashPassword(dto.password);

    return this.prisma.bot.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: dto.password,
        teamId: dto.teamId,
      },
    });
  }

  public async delete(dto: BotRegistrationDto) {
    return this.prisma.bot.delete({
      where: {
        name: dto.name,
      },
    });
  }

  public async getByEmailAndPassword(botRecoveryDto: BotRecoveryDto) {
    const existingBot = await this.prisma.bot.findFirst({
      where: {
        email: botRecoveryDto.email,
      },
    });

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
