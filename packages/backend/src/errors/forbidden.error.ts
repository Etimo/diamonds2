import { DiamondsBaseError } from "./base.error.ts";

export class ForbiddenError extends DiamondsBaseError {
  constructor(message: string, errorTag?: string) {
    super(message, errorTag);
  }
}
