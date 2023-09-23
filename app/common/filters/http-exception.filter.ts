import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  HttpAdapterHost
} from '@nestjs/core';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ErrorResponse } from '@app/common/interfaces/response';

@Catch()
export class HttpExceptionFilter
  implements ExceptionFilter<HttpException | Error>
{
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException | Error, host: ArgumentsHost): any {
    this.logger.error(exception.message, exception.stack);
    const { httpAdapter } = this.httpAdapterHost;
    const ctx: HttpArgumentsHost = host.switchToHttp();

    if (exception instanceof HttpException) {
      const responseBody: ErrorResponse = {
        status: 'error',
        message: exception.message,
      };
      return httpAdapter.reply(
        ctx.getResponse(),
        responseBody,
        exception.getStatus(),
      );
    }

    const responseBody: ErrorResponse = {
      status: 'error',
      message: exception.message,
    };
    return httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
