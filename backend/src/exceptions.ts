import { BotsErrors } from "./enums/bots-errors.enum";

export class ValidationException extends Error {
  constructor(botErrors: BotsErrors) {
    super(botErrors);
  }
}
