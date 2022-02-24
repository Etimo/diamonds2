import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { BotRegistrationDto } from "../../models/bot-registration.dto";
import { BotRegistrationsEntity } from "../models/botRegistrations.entity";

@Injectable()
export class BotsRepository {
  constructor(
    @InjectRepository(BotRegistrationsEntity)
    private readonly repo: Repository<BotRegistrationsEntity>,
  ) {}

  public async getByEmail(email: string): Promise<BotRegistrationsEntity> {
    return this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.email = :email", {
        email,
      })
      .getOne();
  }

  public async getByToken(token: string): Promise<BotRegistrationsEntity> {
    return this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.token = :token", {
        token,
      })
      .getOne();
  }

  public async getByName(name: string): Promise<BotRegistrationsEntity> {
    return this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.botName = :name", {
        name,
      })
      .getOne();
  }

  public async create(
    dto: BotRegistrationDto,
  ): Promise<BotRegistrationsEntity> {
    return await this.repo.save(dto);
  }

  public async deleteByName(name: string) {
    return this.repo
      .createQueryBuilder()
      .delete()
      .from("bot_registrations")
      .where("botName = :botName", { botName: name })
      .execute();
  }

  public async setPassword(
    token: string,
    password: string,
  ): Promise<UpdateResult> {
    return this.repo
      .createQueryBuilder()
      .update("bot_registrations")
      .set({ password })
      .where("token = :token", {
        token,
      })
      .execute();
  }
}
