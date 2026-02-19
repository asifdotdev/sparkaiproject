import { Request, Response, NextFunction } from 'express';
import { PaymentService } from '../services/payment.service';
import { ApiResponse } from '../utils/apiResponse';

export class PaymentController {
  static async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.initiate(req.user!.userId, req.body);
      ApiResponse.created(res, payment, 'Payment processed');
    } catch (error) {
      next(error);
    }
  }

  static async getByBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.getByBooking(parseInt(req.params.bookingId));
      ApiResponse.success(res, payment);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const payment = await PaymentService.getById(parseInt(req.params.id));
      ApiResponse.success(res, payment);
    } catch (error) {
      next(error);
    }
  }
}
