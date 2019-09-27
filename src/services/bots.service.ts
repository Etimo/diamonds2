import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { IdService } from "./id.service";
import { ValidatorService } from "./validator.service";
import { ValidationException } from "src/exceptions";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotsErrors } from "src/enums/bots-errors.enum";
import { BotDto } from "src/models/bot.dto";
import ConflictError from "src/errors/conflict.error";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    private readonly idService: IdService,
    private readonly validatorService: ValidatorService,
  ) {}

  public async add(input: BotRegistrationDto): Promise<IBot> {
    if (this.emailExists(input.email) || this.nameExists(input.name)) {
      throw new ConflictError("Email and/or name already exists");
    }
    const bot = {
      token: this.idService.next().toString(),
      name: input.name,
      email: input.email,
      id: this.idService.next().toString(),
    };
    this.bots.push(bot);
    return Promise.resolve(bot);
  }

  public async get(token: string): Promise<IBot> {
    return this.bots.find(b => b.token === token);
  }

  all(): IBot[] {
    return [...this.bots];
  }

  private emailExists(email: string) {
    email = email.toLowerCase();
    return this.bots.some((bot: IBot) => bot.email.toLowerCase() === email);
  }
  private nameExists(name: string) {
    name = name.toLowerCase();
    return this.bots.some((bot: IBot) => bot.name.toLowerCase() === name);
  }
}
