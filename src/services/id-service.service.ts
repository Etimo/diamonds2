import { Injectable } from '@nestjs/common';

@Injectable()
export class IdService {
    private counter = 1;

    next(): string {
        return `${this.counter++}-${Math.random()}`;
    }
}
