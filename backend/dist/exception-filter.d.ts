import { ExceptionFilter, ArgumentsHost, HttpException } from "@nestjs/common";
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly exceptionMap;
    catch(exception: Error, host: ArgumentsHost): void;
    mapException(exception: Error): HttpException;
}
