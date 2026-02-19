import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../utils/apiResponse';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getProfile(req.user!.userId);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.updateProfile(req.user!.userId, req.body);
      ApiResponse.success(res, user, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }

  static async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'No file uploaded' } });
      }
      const avatarUrl = `/uploads/${req.file.filename}`;
      const user = await UserService.updateAvatar(req.user!.userId, avatarUrl);
      ApiResponse.success(res, user, 'Avatar updated');
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await UserService.changePassword(req.user!.userId, currentPassword, newPassword);
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
