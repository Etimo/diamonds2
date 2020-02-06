import { ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { ValidationException } from "./exceptions";
export declare class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: ValidationException, host: ArgumentsHost): void;
}
