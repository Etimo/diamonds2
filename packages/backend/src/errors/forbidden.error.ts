import { DiamondsBaseError } from "./base.error";

export class ForbiddenError extends DiamondsBaseError {
  constructor(message: string, errorTag?: string) {
    super(message, errorTag);
  }
}
