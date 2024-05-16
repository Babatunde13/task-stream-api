import Axios from 'axios';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | unknown, host: ArgumentsHost) {
    const logger = new Logger('HTTP EXCEPTION');
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    logger.error(`Fatal exception ${exception}`, exception, ctx);
    if (exception instanceof HttpException) {
      const httpStatus = exception.getStatus();
      const message = this.transformMessage(exception.getResponse());
      response.status(httpStatus).json({
        status: 'error',
        success: false,
        message,
        data: {},
      });
    } else if (Axios.isAxiosError(exception)) {
      const error: any = exception.response;
      if (
        error?.data &&
        [400, 404].includes(error?.status) &&
        error?.data?.message
      ) {
        return response.status(error?.status).json({
          status: 'error',
          success: false,
          message: error.data.message,
          data: {},
        });
      }
      response.status(500).json({
        status: 'error',
        success: false,
        message: 'Request not completed, please try again',
        data: {},
      });
    } else {
      const { message, status } = this.parseUnhandleException(exception);
      response.status(status || HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: 'error',
        success: false,
        message,
        data: {},
      });
    }
  }

  private transformMessage(message: string | object): string {
    if (typeof message === 'string') {
      return message;
    }

    //validation pipe error
    if (Array.isArray(message['message'])) {
      return message['message'][0];
    }
    return message['message'] || 'An unknown error occured';
  }

  private parseUnhandleException(exception: unknown): {
    message: string;
    status: number;
  } {
    if (typeof exception === 'object') {
      // check for mongoose unique index error
      if (exception['code'] === 11000) {
        const firstKey = Object.keys(exception['keyValue']).at(0);
        const message = `The ${firstKey} '${exception['keyValue'][firstKey]}' already exist`;
        return { message, status: 400 };
      }
    }

    return {
      message: 'An unknown error occured',
      status: HttpStatus.BAD_REQUEST,
    };
  }
}
