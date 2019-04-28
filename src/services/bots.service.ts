import { Injectable } from "@nestjs/common";
import { IBot } from "src/interfaces/bot.interface";
import { ICreateBotInput } from "src/interfaces/create-bot-input.interface";
import { IdService } from "./id-service.service";
import { ValidatorService } from "./validator.service";
import { ValidationException } from "src/exceptions";

@Injectable()
export class BotsService {
  private bots: IBot[] = [];

  constructor(
    private readonly idService: IdService,
    private readonly validatorService: ValidatorService,
  ) {}

  add(input: ICreateBotInput): IBot {
    if (!this.validatorService.isValidEmail(input.email)) {
      throw new ValidationException("Invalid email");
    }
    if (this.emailExists(input.email)) {
      throw new ValidationException("Existing email");
    }
    const bot = {
      token: this.idService.next(),
      name: input.name,
      email: input.email,
      id: this.idService.next(),
    };
    this.bots.push(bot);
    return bot;
  }

  all(): IBot[] {
    return [...this.bots];
  }

  private emailExists(email: string) {
    email = email.toLowerCase();
    return this.bots.some((bot: IBot) => bot.email.toLowerCase() === email);
  }
}
