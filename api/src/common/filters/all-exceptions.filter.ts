import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        const ctx = host.switchToHttp();

        const httpStatus =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal Server Error' };

        let errorBody: any = {};

        // Normalize error code
        if (typeof exceptionResponse === 'string') {
            errorBody = { code: 'UNKNOWN_ERROR', message: exceptionResponse };
        } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
            errorBody = exceptionResponse as any;
            // NestJS default ValidationPipe returns { message: string[], error: string, statusCode: number }
            // We want to transform specific formats if needed, but primarily ensure { error: { code: ... } } structure.

            // If it's a validation error with typical Nest structure
            if (Array.isArray(errorBody.message)) {
                errorBody = {
                    code: 'VALIDATION_ERROR',
                    details: errorBody.message,
                    message: 'Validation failed'
                };
            }

            // If it doesn't have a code, try to infer one or default
            if (!errorBody.code) {
                errorBody.code = errorBody.error ? errorBody.error.toUpperCase().replace(/\s+/g, '_') : 'UNKNOWN_ERROR';
            }
        }

        const responseBody = {
            error: {
                code: errorBody.code,
                message: errorBody.message,
                details: errorBody.details
            },
            timestamp: new Date().toISOString(),
            path: httpAdapter.getRequestUrl(ctx.getRequest()),
        };

        httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
}
