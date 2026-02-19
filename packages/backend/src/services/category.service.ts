import { Op } from 'sequelize';
import { Category, Service } from '../db/models';
import { ApiError } from '../utils/apiError';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

export class CategoryService {
  static async getAll(query: any) {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['sort_order', 'ASC']],
    });
    return categories;
  }

  static async getById(id: number) {
    const category = await Category.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'services',
          where: { isActive: true },
          required: false,
        },
      ],
    });

    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return category;
  }

  static async create(data: { name: string; description?: string; image?: string; sortOrder?: number; isActive?: boolean }) {
    return Category.create(data);
  }

  static async update(id: number, data: Partial<{ name: string; description: string; image: string; sortOrder: number; isActive: boolean }>) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    await category.update(data);
    return category;
  }

  static async delete(id: number) {
    const category = await Category.findByPk(id);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    await category.update({ isActive: false });
    return { message: 'Category deactivated' };
  }
}
