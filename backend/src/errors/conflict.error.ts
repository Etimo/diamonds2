import DiamondsBaseError from "./base.error";

export default class ConflictError extends DiamondsBaseError {
  constructor(message: string, errorTag: string = null) {
    super(message, errorTag);
  }
}
