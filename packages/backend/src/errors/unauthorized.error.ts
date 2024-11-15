import { DiamondsBaseError } from "./base.error.ts";

export class UnauthorizedError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
