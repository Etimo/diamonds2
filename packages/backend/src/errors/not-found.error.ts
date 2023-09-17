import { DiamondsBaseError } from "./base.error";

export  class NotFoundError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
