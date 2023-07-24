import { ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

export class LogExceptionFilter extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    Logger.error({
      message: exception.message,
      stack: exception.stack,
    });

    super.catch(exception, host);
  }
}
