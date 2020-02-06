import { BotsErrors } from "./enums/bots-errors.enum";
export declare class ValidationException extends Error {
    constructor(botErrors: BotsErrors);
}
