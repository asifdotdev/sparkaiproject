import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../utils/apiResponse';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      ApiResponse.created(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      ApiResponse.success(res, result, 'Login successful');
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Refresh token required' } });
      }
      const result = await AuthService.refreshToken(refreshToken);
      ApiResponse.success(res, result, 'Token refreshed');
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.getMe(req.user!.userId);
      ApiResponse.success(res, user);
    } catch (error) {
      next(error);
    }
  }
}
