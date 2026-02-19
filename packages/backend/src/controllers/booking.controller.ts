import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { ApiResponse } from '../utils/apiResponse';

export class BookingController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.create(req.user!.userId, req.body);
      ApiResponse.created(res, booking, 'Booking created');
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await BookingService.getAll(req.user!.userId, req.user!.role, req.query);
      ApiResponse.success(res, result.bookings, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.getById(
        parseInt(req.params.id),
        req.user!.userId,
        req.user!.role,
      );
      ApiResponse.success(res, booking);
    } catch (error) {
      next(error);
    }
  }

  static async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.accept(parseInt(req.params.id), req.user!.userId);
      ApiResponse.success(res, booking, 'Booking accepted');
    } catch (error) {
      next(error);
    }
  }

  static async reject(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.reject(parseInt(req.params.id), req.user!.userId);
      ApiResponse.success(res, booking, 'Booking rejected');
    } catch (error) {
      next(error);
    }
  }

  static async start(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.start(parseInt(req.params.id), req.user!.userId);
      ApiResponse.success(res, booking, 'Booking started');
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.complete(parseInt(req.params.id), req.user!.userId);
      ApiResponse.success(res, booking, 'Booking completed');
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.cancel(
        parseInt(req.params.id),
        req.user!.userId,
        req.user!.role,
        req.body.reason,
      );
      ApiResponse.success(res, booking, 'Booking cancelled');
    } catch (error) {
      next(error);
    }
  }
}
