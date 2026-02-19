import { Op } from 'sequelize';
import { Service, Category, ProviderProfile, User } from '../db/models';
import { ApiError } from '../utils/apiError';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

export class ServiceService {
  static async getAll(query: any) {
    const params = parsePagination(query);
    const where: any = { isActive: true };

    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }

    if (query.search) {
      where.name = { [Op.like]: `%${query.search}%` };
    }

    if (query.minPrice || query.maxPrice) {
      where.price = {};
      if (query.minPrice) where.price[Op.gte] = parseFloat(query.minPrice);
      if (query.maxPrice) where.price[Op.lte] = parseFloat(query.maxPrice);
    }

    const { count, rows } = await Service.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'image'] }],
      ...paginateQuery(params),
    });

    return {
      services: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async getById(id: number) {
    const service = await Service.findByPk(id, {
      include: [
        { model: Category, as: 'category' },
        {
          model: ProviderProfile,
          as: 'providers',
          where: { isAvailable: true, verified: true },
          required: false,
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'phone'] }],
        },
      ],
    });

    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    return service;
  }

  static async search(query: string) {
    const services = await Service.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { name: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      limit: 20,
    });

    return services;
  }

  static async create(data: any) {
    const category = await Category.findByPk(data.categoryId);
    if (!category) {
      throw ApiError.notFound('Category not found');
    }

    return Service.create(data);
  }

  static async update(id: number, data: any) {
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    await service.update(data);
    return service;
  }

  static async delete(id: number) {
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    await service.update({ isActive: false });
    return { message: 'Service deactivated' };
  }
}
