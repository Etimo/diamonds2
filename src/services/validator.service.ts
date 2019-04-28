import { Injectable } from "@nestjs/common";

@Injectable()
export class ValidatorService {
  isValidEmail(input: string): boolean {
    return input.includes("@");
  }

  isValidName(input: string): boolean {
    return input.length > 0;
  }
}
