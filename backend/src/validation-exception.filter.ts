import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from "@nestjs/common";
import { Response } from "express";
import { ValidationException } from "./exceptions";

@Catch(ValidationException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).json({
      statusCode: 400,
      message: exception.message,
    });
  }
}
