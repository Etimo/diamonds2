import { DiamondsBaseError } from "./base.error.ts";

export class ConflictError extends DiamondsBaseError {
  constructor(message: string, errorTag?: string) {
    super(message, errorTag);
  }
}
