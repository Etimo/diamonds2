import { BotsErrors } from "./enums/index.ts";

export class ValidationException extends Error {
  constructor(botErrors: BotsErrors) {
    super(botErrors);
  }
}
