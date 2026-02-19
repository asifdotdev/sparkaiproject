import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponse } from '../utils/apiResponse';

export class NotificationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.getUserNotifications(req.user!.userId, req.query);
      ApiResponse.success(res, result.data, 'Notifications retrieved', 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.getUnreadCount(req.user!.userId);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const notification = await NotificationService.markAsRead(req.user!.userId, parseInt(req.params.id));
      ApiResponse.success(res, notification, 'Notification marked as read');
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await NotificationService.markAllAsRead(req.user!.userId);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
