import { Response } from 'express';

export class ApiResponse {
  static success<T>(res: Response, data: T, message?: string, statusCode = 200, meta?: any) {
    return res.status(statusCode).json({
      success: true,
      data,
      message,
      meta,
    });
  }

  static created<T>(res: Response, data: T, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }
}
