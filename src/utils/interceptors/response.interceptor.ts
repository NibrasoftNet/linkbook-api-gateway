import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: unknown) => this.responseHandler(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const info = gqlContext.getInfo();
    const args = gqlContext.getArgs();
    const response = gqlContext.getContext().res;
    const resolverName = info.parentType.name;
    const fieldName = info.fieldName;
    console.log('fggfdgdfsgfdsg', args);
    const status = exception.getStatus() ?? 500;

    return 'info.fieldName'
  }

  responseHandler(res: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode: statusCode,
      result: res,
    };
  }
}
