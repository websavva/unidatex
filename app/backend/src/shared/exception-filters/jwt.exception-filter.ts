import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import {
  JsonWebTokenError,
  TokenExpiredError as JsonWebTokenExpiredError,
} from 'jsonwebtoken';

@Catch(JsonWebTokenError)
export class JwtExceptionFilter implements ExceptionFilter {
  catch(exception: JsonWebTokenError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let jsonWebTokenErrorMessage: string;
    if (exception instanceof JsonWebTokenExpiredError) {
      jsonWebTokenErrorMessage = 'Token has expired';
    } else {
      jsonWebTokenErrorMessage = 'Invalid token was provided';
    }

    const statusCode = HttpStatus.BAD_REQUEST;

    response.status(statusCode).json({
      statusCode,
      message: jsonWebTokenErrorMessage,
      path: request.url,
    });
  }
}
