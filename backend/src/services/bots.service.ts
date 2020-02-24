import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import ConflictError from "../errors/conflict.error";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BotRegistrationsEntity } from "../db/models/botRegistrations.entity";
import { BotRegistrationPublicDto } from "../models/bot-registration-public.dto";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    @InjectRepository(BotRegistrationsEntity)
    private readonly repo: Repository<BotRegistrationsEntity>,
  ) {
    // console.log(repo.createQueryBuilder);
    // this.bots.push({
    //   id: idService.next(),
    //   token: idService.next(),
    //   name: "test",
    //   email: "test@test.se",
    // });
    // this.bots.push({
    //   id: idService.next(),
    //   token: idService.next(),
    //   name: "test2",
    //   email: "test2@test.se",
    // });
  }

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
    // const bot = {
    //   token: this.idService.next().toString(),
    //   name: input.name,
    //   email: input.email,
    //   id: this.idService.next().toString(),
    // };

    // this.bots.push(bot);
    //return Promise.resolve(bot);
    return this.create(input);
  }

  public async get(token: string): Promise<IBot> {
    const existBot = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.token = :token", { token: token })
      .getOne()
      .then(botRegistrationsEntity =>
        BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
      );
    console.log(existBot);
    return existBot;
    // return await this.repo
    //   .save(dto)
    //   .then(botRegistrationsEntity =>
    //     BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
    //   );
    //return this.bots.find(b => b.token === token);
  }

  private async emailExists(email: string) {
    email = email.toLowerCase();

    const existEmail = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.email = :email", { email: email })
      .getOne();
    //    console.log(!existEmail);
    return existEmail;

    //this.bots.some((bot: IBot) => bot.email.toLowerCase() === email);
  }

  private async nameExists(name: string) {
    name = name.toLowerCase();
    const existName = await this.repo
      .createQueryBuilder("botRegistrations")
      .where("botRegistrations.botName = :botName", { botName: name })
      .getOne();
    //console.log(!firstUser);
    return existName; //this.bots.some((bot: IBot) => bot.name.toLowerCase() === name);
  }

  public async create(
    dto: BotRegistrationDto,
  ): Promise<BotRegistrationPublicDto> {
    return await this.repo
      .save(dto)
      .then(botRegistrationsEntity =>
        BotRegistrationPublicDto.fromEntity(botRegistrationsEntity),
      );
  }
}
