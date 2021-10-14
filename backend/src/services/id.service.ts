import { Injectable } from "@nestjs/common";
import { isLocal } from "../hooks/environment";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class IdService {
  private counter = 1;

  next(): string {
    if (isLocal()) {
      return `${this.counter++}`;
    } else {
      return uuidv4();
    }
    // return `${this.counter++}-${Math.random()}`;
  }
}
