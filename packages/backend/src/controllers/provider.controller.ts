import { Request, Response, NextFunction } from 'express';
import { ProviderService_ } from '../services/provider.service';
import { ApiResponse } from '../utils/apiResponse';

export class ProviderController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProviderService_.getAll(req.query);
      ApiResponse.success(res, result.providers, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = await ProviderService_.getById(parseInt(req.params.id));
      ApiResponse.success(res, provider);
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = await ProviderService_.updateProfile(req.user!.userId, req.body);
      ApiResponse.success(res, provider, 'Profile updated');
    } catch (error) {
      next(error);
    }
  }

  static async toggleAvailability(req: Request, res: Response, next: NextFunction) {
    try {
      const provider = await ProviderService_.toggleAvailability(req.user!.userId);
      ApiResponse.success(res, provider, 'Availability updated');
    } catch (error) {
      next(error);
    }
  }

  static async getMyServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ProviderService_.getMyServices(req.user!.userId);
      ApiResponse.success(res, services);
    } catch (error) {
      next(error);
    }
  }

  static async addService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, customPrice } = req.body;
      const result = await ProviderService_.addService(req.user!.userId, serviceId, customPrice);
      ApiResponse.created(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async removeService(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ProviderService_.removeService(req.user!.userId, parseInt(req.params.serviceId));
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const dashboard = await ProviderService_.getDashboard(req.user!.userId);
      ApiResponse.success(res, dashboard);
    } catch (error) {
      next(error);
    }
  }
}
