import { Catch, HttpException, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const _host = host;

    const status = exception.getStatus();
    const message = exception.message;

    return throwError(() => new RpcException({ status, message }));
  }
}
