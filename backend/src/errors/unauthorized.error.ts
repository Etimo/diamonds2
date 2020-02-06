import DiamondsBaseError from "./base.error";

export default class UnauthorizedError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
