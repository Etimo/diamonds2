import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
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

    console.log(exception, httpException);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      data: exception.message,
    });
  }

  mapException(exception: Error): HttpException {
    // @ts-ignore
    const output = this.exceptionMap[exception.constructor.name];
    if (output) {
      return new output(exception.message);
    } else if (exception instanceof HttpException) {
      return exception;
    }
    return new InternalServerErrorException(exception.message);
  }
}
