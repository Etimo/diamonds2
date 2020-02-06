import DiamondsBaseError from "./base.error";

export default class ForbiddenError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
