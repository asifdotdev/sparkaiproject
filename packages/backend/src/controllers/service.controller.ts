import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import { ApiResponse } from '../utils/apiResponse';

export class ServiceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ServiceService.getAll(req.query);
      ApiResponse.success(res, result.services, undefined, 200, result.meta);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.getById(parseInt(req.params.id));
      ApiResponse.success(res, service);
    } catch (error) {
      next(error);
    }
  }

  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await ServiceService.search(req.query.q as string || '');
      ApiResponse.success(res, services);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.create(req.body);
      ApiResponse.created(res, service);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.update(parseInt(req.params.id), req.body);
      ApiResponse.success(res, service, 'Service updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await ServiceService.delete(parseInt(req.params.id));
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
