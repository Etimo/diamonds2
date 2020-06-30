import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class IdService {
  private counter = 1;

  next(): string {
    const env = process.env["ENVIRONMENT"];
    if (env == "development") {
      return `${this.counter++}`;
    } else {
      return uuidv4();
    }
    // return `${this.counter++}-${Math.random()}`;
  }
}
