// import { HttpResponse } from '@/dto/http-response.dto';
// import {
//   CallHandler,
//   ExecutionContext,
//   Injectable,
//   NestInterceptor,
// } from '@nestjs/common';
// import { STATUS_CODES } from 'http';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';

// @Injectable()
// export class ResponseTransformInterceptor<T>
//   implements NestInterceptor<T, HttpResponse<T>>
// {
//   intercept(
//     context: ExecutionContext,
//     next: CallHandler,
//   ): Observable<HttpResponse<T>> {
//     const statusCode = context.switchToHttp().getResponse().statusCode;

//     return next.handle().pipe(
//       map((body) => ({
//         timestamp: new Date().toISOString(),
//         statusCode,
//         message: STATUS_CODES[statusCode],
//         body,
//       })),
//     );
//   }
// }
