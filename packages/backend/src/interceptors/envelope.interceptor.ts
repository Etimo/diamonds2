import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface Response<T> {
  data: T;
}

@Injectable()
export class EnvelopeInterceptor<T> implements NestInterceptor<T, Response<T>> {
  constructor() {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.getArgByIndex(0);
    const res = context.getArgByIndex(1);

    return next.handle().pipe(
      map((data) => {
        if (req.url.includes("/api/slack/")) {
          return data;
        }
        return {
          statusCode: res.status,
          timestamp: new Date().toISOString(),
          path: req.url,
          data,
        };
      }),
    );
  }
}
