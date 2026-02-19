import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { ApiResponse } from '../utils/apiResponse';

export class ReviewController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.create(req.user!.userId, req.body);
      ApiResponse.created(res, review, 'Review submitted');
    } catch (error) {
      next(error);
    }
  }

  static async getByBooking(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.getByBooking(parseInt(req.params.bookingId));
      ApiResponse.success(res, review);
    } catch (error) {
      next(error);
    }
  }

  static async getProviderReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const reviews = await ReviewService.getProviderReviews(parseInt(req.params.providerId), req.query);
      ApiResponse.success(res, reviews);
    } catch (error) {
      next(error);
    }
  }
}
