import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class TimingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.getArgByIndex(0);
    const res = context.getArgByIndex(1);

    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.debug(
            `Request timing for ${req.url}: ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
