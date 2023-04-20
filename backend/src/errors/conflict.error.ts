import { DiamondsBaseError } from "./base.error";

export class ConflictError extends DiamondsBaseError {
  constructor(message: string, errorTag: string = null) {
    super(message, errorTag);
  }
}
