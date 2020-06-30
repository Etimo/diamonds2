import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";
import { MetricsService } from "./metrics.service";
import { BotRecoveryDto } from "src/models/bot-recovery-dto";
import * as bcrypt from "bcrypt";
import NotFoundError from "../errors/not-found.error";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    @InjectRepository(BotRegistrationsEntity)
    private readonly repo: Repository<BotRegistrationsEntity>,
    private metricsService: MetricsService,
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
    // Need to create the object to trigger BeforeInsert!
    const bot = this.repo.create(dto);
    return await this.repo
      .save(bot)
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

    if (existBot) {
      // Return bot if password is correct
      console.log(existBot.password);
      console.log(botRecoveryDto.password);
      if (await bcrypt.compare(botRecoveryDto.password, existBot.password)) {
        return BotRegistrationPublicDto.fromEntity(existBot);
      }
    }
    return Promise.reject(new NotFoundError("Invalid email or pasword"));
  }
}
