import { IBot } from "src/interfaces/bot.interface";
import { IdService } from "./id.service";
import { BotRegistrationDto } from "src/models/bot-registration.dto";
export declare class BotsService {
    private readonly idService;
    private bots;
    constructor(idService: IdService);
    add(input: BotRegistrationDto): Promise<IBot>;
    get(token: string): Promise<IBot>;
    all(): IBot[];
    private emailExists;
    private nameExists;
}
