import { Op } from 'sequelize';
import { ProviderProfile, User, Service, ProviderService, Review, Booking } from '../db/models';
import { ApiError } from '../utils/apiError';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

export class ProviderService_ {
  static async getAll(query: any) {
    const params = parsePagination(query);
    const where: any = {};

    if (query.verified !== undefined) {
      where.verified = query.verified === 'true';
    }

    if (query.available !== undefined) {
      where.isAvailable = query.available === 'true';
    }

    const { count, rows } = await ProviderProfile.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'avatar'] },
        { model: Service, as: 'services', through: { attributes: [] }, attributes: ['id', 'name', 'price'] },
      ],
      ...paginateQuery(params),
    });

    return {
      providers: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async getById(id: number) {
    const provider = await ProviderProfile.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'avatar', 'address'] },
        { model: Service, as: 'services', through: { attributes: ['custom_price'] } },
        {
          model: Review,
          as: 'reviews',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
          limit: 10,
          order: [['created_at', 'DESC']],
        },
      ],
    });

    if (!provider) {
      throw ApiError.notFound('Provider not found');
    }

    return provider;
  }

  static async updateProfile(userId: number, data: { bio?: string; experienceYears?: number }) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    await provider.update(data);
    return provider;
  }

  static async toggleAvailability(userId: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    await provider.update({ isAvailable: !provider.isAvailable });
    return provider;
  }

  static async addService(userId: number, serviceId: number, customPrice?: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    const service = await Service.findByPk(serviceId);
    if (!service) {
      throw ApiError.notFound('Service not found');
    }

    const existing = await ProviderService.findOne({
      where: { providerId: provider.id, serviceId },
    });
    if (existing) {
      throw ApiError.conflict('Service already added');
    }

    await ProviderService.create({
      providerId: provider.id,
      serviceId,
      customPrice: customPrice || null,
    });

    return { message: 'Service added successfully' };
  }

  static async removeService(userId: number, serviceId: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    const providerService = await ProviderService.findOne({
      where: { providerId: provider.id, serviceId },
    });
    if (!providerService) {
      throw ApiError.notFound('Service not found in your offerings');
    }

    await providerService.destroy();
    return { message: 'Service removed successfully' };
  }

  static async getMyServices(userId: number) {
    const provider = await ProviderProfile.findOne({
      where: { userId },
      include: [{ model: Service, as: 'services', through: { attributes: ['custom_price'] } }],
    });

    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    return (provider as any).services;
  }

  static async getDashboard(userId: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) {
      throw ApiError.notFound('Provider profile not found');
    }

    const totalBookings = await Booking.count({ where: { providerId: provider.id } });
    const completedBookings = await Booking.count({ where: { providerId: provider.id, status: 'completed' } });
    const pendingBookings = await Booking.count({ where: { providerId: provider.id, status: 'pending' } });
    const activeBookings = await Booking.count({
      where: { providerId: provider.id, status: { [Op.in]: ['accepted', 'in_progress'] } },
    });

    return {
      provider,
      stats: {
        totalBookings,
        completedBookings,
        pendingBookings,
        activeBookings,
        rating: provider.rating,
        totalJobs: provider.totalJobs,
      },
    };
  }
}
