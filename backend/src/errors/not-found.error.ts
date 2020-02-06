import DiamondsBaseError from "./base.error";

export default class NotFoundError extends DiamondsBaseError {
  constructor(message: string) {
    super(message);
  }
}
