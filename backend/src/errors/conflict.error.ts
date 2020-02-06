import DiamondsBaseError from "./base.error";

export default class ConflictError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
