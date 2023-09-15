export class DiamondsBaseError extends Error {
  errorTag?: string;
  constructor(message: string, errorTag?: string) {
    super(message);
    if (errorTag) {
      this.errorTag = errorTag;
    }
  }
}
