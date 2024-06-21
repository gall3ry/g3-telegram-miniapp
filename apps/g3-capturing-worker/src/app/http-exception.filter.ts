import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseBody: any = {
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      responseBody = {
        ...responseBody,
        statusCode: httpStatus,
        message: exception.getResponse(),
      };
    } else if (exception instanceof ZodError) {
      httpStatus = HttpStatus.BAD_REQUEST; // 400 status code for validation errors
      responseBody = {
        ...responseBody,
        statusCode: httpStatus,
        message: 'Validation failed',
        errors: exception.errors.map((error) => ({
          path: error.path.join('.'),
          message: error.message,
        })),
      };
    } else {
      responseBody = {
        ...responseBody,
        statusCode: httpStatus,
        message: 'Internal server error',
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
