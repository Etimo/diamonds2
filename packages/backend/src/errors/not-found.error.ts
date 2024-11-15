import { DiamondsBaseError } from "./base.error.ts";

export class NotFoundError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
