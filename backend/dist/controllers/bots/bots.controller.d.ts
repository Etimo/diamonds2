import { BotRegistrationDto } from "src/models/bot-registration.dto";
import { BotsService } from "src/services/bots.service";
import { IBot } from "src/interfaces/bot.interface";
export declare class BotsController {
    private botService;
    constructor(botService: BotsService);
    create(botRegistration: BotRegistrationDto): Promise<IBot>;
    findAll(token: string): Promise<IBot>;
}
