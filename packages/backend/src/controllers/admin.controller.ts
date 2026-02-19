import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { ApiResponse } from '../utils/apiResponse';

export class AdminController {
  static async getDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await AdminService.getDashboard();
      ApiResponse.success(res, stats);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllUsers(req.query);
      ApiResponse.success(res, result.users, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.getUserById(parseInt(req.params.id));
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AdminService.updateUser(parseInt(req.params.id), req.body);
      ApiResponse.success(res, user, 'User updated');
    } catch (error) {
      next(error);
    }
  }

  static async getAllProviders(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllProviders(req.query);
      ApiResponse.success(res, result.providers, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async verifyProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { verified } = req.body;
      const provider = await AdminService.verifyProvider(parseInt(req.params.id), verified);
      ApiResponse.success(res, provider, 'Provider verification updated');
    } catch (error) {
      next(error);
    }
  }

  static async getAllBookings(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllBookings(req.query);
      ApiResponse.success(res, result.bookings, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async assignProvider(req: Request, res: Response, next: NextFunction) {
    try {
      const { providerId } = req.body;
      const booking = await AdminService.assignProvider(parseInt(req.params.id), providerId);
      ApiResponse.success(res, booking, 'Provider assigned');
    } catch (error) {
      next(error);
    }
  }

  static async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllPayments(req.query);
      ApiResponse.success(res, result.payments, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.getAllReviews(req.query);
      ApiResponse.success(res, result.reviews, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AdminService.deleteReview(parseInt(req.params.id));
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
