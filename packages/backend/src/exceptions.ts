import { BotsErrors } from "./enums";

export class ValidationException extends Error {
  constructor(botErrors: BotsErrors) {
    super(botErrors);
  }
}
