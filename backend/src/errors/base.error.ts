export default class DiamondsBaseError extends Error {
  errorTag?: string;
  constructor(message: string, errorTag: string = null) {
    super(message);
    if (errorTag) {
      this.errorTag = errorTag;
    }
  }
}
