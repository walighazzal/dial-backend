import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  HttpStatus,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Default status code and error message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';

    // Check if the exception is an instance of HttpException
    if (exception instanceof QueryFailedError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Database query error: ' + exception.message;
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Entity not found: ' + exception.message;
    } else if (exception instanceof BadRequestException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof UnauthorizedException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof ForbiddenException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof NotFoundException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.getResponse() as string;
    }

    // Log the error
    console.error(exception);

    // Send the response with the appropriate status code and error message
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toLocaleString('en-PK', {
        timeZone: 'Asia/Karachi',
      }),
      path: request.url,
      message,
    });
  }
}
