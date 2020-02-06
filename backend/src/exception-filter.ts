import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly exceptionMap = {
    NotFoundError: NotFoundException,
    ConflictError: ConflictException,
    UnauthorizedError: UnauthorizedException,
    ForbiddenError: ForbiddenException,
  };

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

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
