import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import ForbiddenError from "../errors/forbidden.error";
import NotFoundError from "../errors/not-found.error";
import { BotPasswordDto } from "../models/bot-password.dto";
import { BotRecoveryDto } from "../models/bot-recovery.dto";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { PrismaService } from "./prisma.service";
import { TeamsService } from "./teams.service";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    private prisma: PrismaService,
    private teamsService: TeamsService,
  ) {}

  public async add(
    input: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    if (
      (await this.emailExists(input.email)) ||
      (await this.nameExists(input.name))
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

    return this.create(input);
  }

  public async get(token: string): Promise<BotRegistrationPublicDto> {
    return this.prisma.bot
      .findFirst({
        where: {
          token,
        },
      })
      .then((bot) => BotRegistrationPublicDto.fromEntity(bot));
    // const existBot = await this.repo
    //   .createQueryBuilder("botRegistrations")
    //   .where("botRegistrations.token = :token", { token: token })
    //   .getOne()
    //   .then(botRegistrationsEntity =>
    //     BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
    //   );
    // return existBot;
  }

  private async emailExists(email: string) {
    email = email.toLowerCase();

    return this.prisma.bot.findFirst({
      where: {
        email,
      },
    });
    // const existEmail = await this.repo
    //   .createQueryBuilder("botRegistrations")
    //   .where("botRegistrations.email = :email", { email: email })
    //   .getOne();
    // //    console.log(!existEmail);
    // return existEmail;
  }

  private async nameExists(name: string) {
    name = name.toLowerCase();
    return this.prisma.bot.findFirst({
      where: {
        name,
      },
    });
    // const existName = await this.repo
    //   .createQueryBuilder("botRegistrations")
    //   .where("botRegistrations.botName = :botName", { botName: name })
    //   .getOne();
    // //console.log(!firstUser);
    // return existName;
  }

  public async create(dto: BotRegistrationDto) {
    // Hashing password
    dto.password = await this.hashPassword(dto.password);
    return this.prisma.bot
      .create({
        data: dto,
      })
      .then((bot) => BotRegistrationPublicDto.fromEntity(bot));
    // return await this.repo
    //   .save(dto)
    //   .then(botRegistrationsEntity =>
    //     BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
    //   );
  }

  public async delete(dto: BotRegistrationDto) {
    return this.prisma.bot.delete({
      where: {
        name: dto.name,
      },
    });
    // return await this.repo
    //   .createQueryBuilder()
    //   .delete()
    //   .from("bot_registrations")
    //   .where("botName = :botName", { botName: dto.botName })
    //   .execute();
  }

  public async getByEmailAndPassword(botRecoveryDto: BotRecoveryDto) {
    const existingBot = await this.prisma.bot.findFirst({
      where: {
        email: botRecoveryDto.email,
      },
    });
    // const existBot = await this.repo
    //   .createQueryBuilder("botRegistrations")
    //   .where("botRegistrations.email = :email", {
    //     email: botRecoveryDto.email,
    //   })
    //   .getOne();

    // Don't return bots with no password
    if (existingBot && existingBot.password) {
      // Return bot if password is correct
      if (await bcrypt.compare(botRecoveryDto.password, existingBot.password)) {
        return BotRegistrationPublicDto.fromEntity(existingBot);
      }
    }
    return Promise.reject(new NotFoundError("Invalid email or password"));
  }

  public async addPassword(
    botPasswordDto: BotPasswordDto,
  ): Promise<BotRegistrationPublicDto> {
    const existingBot = await this.prisma.bot.findFirst({
      where: {
        token: botPasswordDto.token,
      },
    });
    // const existBot = await this.repo
    //   .createQueryBuilder("botRegistrations")
    //   .where("botRegistrations.token = :token", {
    //     token: botPasswordDto.token,
    //   })
    //   .getOne();
    if (!existingBot) {
      return Promise.reject(new NotFoundError("Bot not found"));
    }

    if (existingBot.password) {
      return Promise.reject(new ForbiddenError("Bot already has a password"));
    }
    const hashedPassword = await this.hashPassword(botPasswordDto.password);
    // await this.repo
    //   .createQueryBuilder()
    //   .update("bot_registrations")
    //   .set({ password: hashedPassword })
    //   .where("token = :token", {
    //     token: botPasswordDto.token,
    //   })
    //   .execute();
    await this.prisma.bot.update({
      data: {
        password: hashedPassword,
      },
      where: {
        token: botPasswordDto.token,
      },
    });

    return BotRegistrationPublicDto.fromEntity(existingBot);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
