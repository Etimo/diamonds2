import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import NotFoundError from "./errors/not-found.error";
import ConflictError from "./errors/conflict.error";
import UnauthorizedError from "./errors/unauthorized.error";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly exceptionMap = {
    NotFoundError: NotFoundException,
    ConflictError: ConflictException,
    UnauthorizedError: UnauthorizedException,
  };

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.error(exception.stack, exception);

    const httpException: HttpException = this.mapException(exception);
    const status = httpException.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: httpException.message,
    });
  }

  mapException(exception: Error): HttpException {
    const output = this.exceptionMap[exception.constructor.name];
    if (output) {
      return new output(exception.message);
    } else if (exception instanceof HttpException) {
      return exception;
    }
    return new InternalServerErrorException(exception.message);
  }
}
