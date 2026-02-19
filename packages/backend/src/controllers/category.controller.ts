import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/apiResponse';

export class CategoryController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await CategoryService.getAll(req.query);
      ApiResponse.success(res, categories);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.getById(parseInt(req.params.id));
      ApiResponse.success(res, category);
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.create(req.body);
      ApiResponse.created(res, category);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await CategoryService.update(parseInt(req.params.id), req.body);
      ApiResponse.success(res, category, 'Category updated');
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await CategoryService.delete(parseInt(req.params.id));
      ApiResponse.success(res, result);
    } catch (error) {
      next(error);
    }
  }
}
