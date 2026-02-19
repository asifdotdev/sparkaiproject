import { Op } from 'sequelize';
import { sequelize } from '../config/database';
import { User, Role, ProviderProfile, Booking, Service, Category, Review, Payment } from '../db/models';
import { ApiError } from '../utils/apiError';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

export class AdminService {
  static async getDashboard() {
    const totalUsers = await User.count({ where: { roleId: 1 } });
    const totalProviders = await User.count({ where: { roleId: 2 } });
    const totalBookings = await Booking.count();
    const activeProviders = await ProviderProfile.count({ where: { isAvailable: true, verified: true } });

    const revenueResult = await Payment.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('amount')), 'total']],
      where: { status: 'completed' },
      raw: true,
    });
    const totalRevenue = parseFloat((revenueResult as any)?.total || '0');

    const recentBookings = await Booking.count({
      where: {
        createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    });

    const bookingsByStatus = await Booking.findAll({
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['status'],
      raw: true,
    });

    return {
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue,
      recentBookings,
      activeProviders,
      bookingsByStatus,
    };
  }

  static async getAllUsers(query: any) {
    const params = parsePagination(query);
    const where: any = {};

    if (query.role) {
      const role = await Role.findOne({ where: { name: query.role } });
      if (role) where.roleId = role.id;
    }

    if (query.search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${query.search}%` } },
        { email: { [Op.like]: `%${query.search}%` } },
      ];
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive === 'true';
    }

    const { count, rows } = await User.findAndCountAll({
      where,
      include: [{ model: Role, as: 'role' }],
      ...paginateQuery(params),
    });

    return {
      users: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async getUserById(id: number) {
    const user = await User.findByPk(id, {
      include: [
        { model: Role, as: 'role' },
        { model: ProviderProfile, as: 'providerProfile' },
      ],
    });

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return user;
  }

  static async updateUser(id: number, data: { isActive?: boolean; roleId?: number }) {
    const user = await User.findByPk(id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await user.update(data);
    return user;
  }

  static async getAllProviders(query: any) {
    const params = parsePagination(query);
    const where: any = {};

    if (query.verified !== undefined) {
      where.verified = query.verified === 'true';
    }

    const { count, rows } = await ProviderProfile.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone', 'avatar', 'isActive'] },
      ],
      ...paginateQuery(params),
    });

    return {
      providers: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async verifyProvider(id: number, verified: boolean) {
    const provider = await ProviderProfile.findByPk(id);
    if (!provider) {
      throw ApiError.notFound('Provider not found');
    }

    await provider.update({ verified });
    return provider;
  }

  static async getAllBookings(query: any) {
    const params = parsePagination(query);
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    if (query.fromDate && query.toDate) {
      where.scheduledDate = { [Op.between]: [query.fromDate, query.toDate] };
    }

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email'] },
        {
          model: ProviderProfile,
          as: 'provider',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price'] },
      ],
      ...paginateQuery(params),
    });

    return {
      bookings: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async assignProvider(bookingId: number, providerId: number) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    const provider = await ProviderProfile.findByPk(providerId);
    if (!provider) {
      throw ApiError.notFound('Provider not found');
    }

    await booking.update({ providerId });
    return booking;
  }

  static async getAllPayments(query: any) {
    const params = parsePagination(query);
    const where: any = {};

    if (query.status) {
      where.status = query.status;
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        {
          model: Booking,
          as: 'booking',
          attributes: ['id', 'userId', 'serviceId'],
          include: [
            { model: User, as: 'customer', attributes: ['id', 'name'] },
            { model: Service, as: 'service', attributes: ['id', 'name'] },
          ],
        },
      ],
      ...paginateQuery(params),
    });

    return {
      payments: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async getAllReviews(query: any) {
    const params = parsePagination(query);

    const { count, rows } = await Review.findAndCountAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name'] },
        {
          model: ProviderProfile,
          as: 'provider',
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
        { model: Booking, as: 'booking', attributes: ['id', 'serviceId'] },
      ],
      ...paginateQuery(params),
    });

    return {
      reviews: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async deleteReview(id: number) {
    const review = await Review.findByPk(id);
    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    await review.destroy();
    return { message: 'Review deleted' };
  }
}
