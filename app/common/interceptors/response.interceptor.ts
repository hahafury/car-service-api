import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponse } from '@app/common/interfaces/response';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, SuccessResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponse> {
    return next.handle().pipe(
      map((data) => ({
        status: 'success',
        data: data,
      })),
    );
  }
}
