import { DiamondsBaseError } from "./base.error";

export class UnauthorizedError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
