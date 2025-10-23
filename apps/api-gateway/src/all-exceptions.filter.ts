import {
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
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

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.getResponse();
      response
        .status(status)
        .json(
          typeof message === 'object'
            ? message
            : { statusCode: status, message },
        );
      return;
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal Server Error';

    if (typeof exception === 'object' && exception !== null) {
      const rpcError = exception as Record<string, unknown>;

      if (typeof rpcError.error === 'object' && rpcError.error !== null) {
        const nestedError = rpcError.error as RpcError;
        if (typeof nestedError.status === 'number') {
          status = nestedError.status;
        }
        if (nestedError.message) {
          message = nestedError.message;
        }
      } else if ('status' in rpcError && 'message' in rpcError) {
        if (typeof rpcError.status === 'number') {
          status = rpcError.status;
        }
        if (rpcError.message) {
          message = rpcError.message;
        }
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
