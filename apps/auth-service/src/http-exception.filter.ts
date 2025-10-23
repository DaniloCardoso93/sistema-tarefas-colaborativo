// apps/auth-service/src/http-exception.filter.ts
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter {
  catch(exception: HttpException, _host: ArgumentsHost) {
    const status = exception.getStatus();
    const message = exception.message;

    return throwError(() => new RpcException({ status, message }));
  }
}
