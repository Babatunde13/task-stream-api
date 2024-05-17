import { Injectable } from '@nestjs/common';

@Injectable()
export class ResponseService {
  successResponse(data: any, message: string) {
    return {
      success: true,
      status: 'success',
      data,
      message,
    };
  }

  errorResponse(message: string, error?: any) {
    return {
      success: false,
      status: 'error',
      message,
      error,
    };
  }
}
