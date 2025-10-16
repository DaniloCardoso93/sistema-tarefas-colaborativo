import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';

interface RpcError {
  status: number;
  message: string | object;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    if (
      typeof exception === 'object' &&
      exception !== null &&
      'error' in exception
    ) {
      const rpcError = exception.error as RpcError;

      status = typeof rpcError.status === 'number' ? rpcError.status : status;
      message = rpcError.message || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
    });
  }
}
