import { Op } from 'sequelize';
import { Booking, Service, User, ProviderProfile, Review, Payment } from '../db/models';
import { ApiError } from '../utils/apiError';
import { BOOKING_STATUS_TRANSITIONS } from '@sparkai/shared';
import type { BookingStatus } from '@sparkai/shared';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

export class BookingService {
  static async create(userId: number, data: {
    serviceId: number;
    providerId?: number;
    scheduledDate: string;
    scheduledTime: string;
    address: string;
    lat?: number;
    lng?: number;
    notes?: string;
  }) {
    const service = await Service.findByPk(data.serviceId);
    if (!service || !service.isActive) {
      throw ApiError.notFound('Service not found or inactive');
    }

    let providerId: number | null = null;
    if (data.providerId) {
      const provider = await ProviderProfile.findByPk(data.providerId);
      if (!provider || !provider.isAvailable || !provider.verified) {
        throw ApiError.badRequest('Provider not available');
      }
      providerId = provider.id;
    }

    const booking = await Booking.create({
      userId,
      providerId,
      serviceId: data.serviceId,
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      address: data.address,
      lat: data.lat || null,
      lng: data.lng || null,
      notes: data.notes || null,
      totalPrice: Number(service.price),
      status: 'pending',
      paymentStatus: 'pending',
    });

    return booking;
  }

  static async getAll(userId: number, role: string, query: any) {
    const params = parsePagination(query);
    const where: any = {};

    // Filter by role
    if (role === 'user') {
      where.userId = userId;
    } else if (role === 'provider') {
      const provider = await ProviderProfile.findOne({ where: { userId } });
      if (!provider) throw ApiError.notFound('Provider profile not found');
      where.providerId = provider.id;
    }

    // Filter by status
    if (query.status) {
      where.status = query.status;
    }

    const { count, rows } = await Booking.findAndCountAll({
      where,
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'avatar'] },
        {
          model: ProviderProfile,
          as: 'provider',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'phone'] }],
        },
        { model: Service, as: 'service', attributes: ['id', 'name', 'price', 'durationMinutes', 'image'] },
      ],
      ...paginateQuery(params),
    });

    return {
      bookings: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  static async getById(id: number, userId: number, role: string) {
    const booking = await Booking.findByPk(id, {
      include: [
        { model: User, as: 'customer', attributes: ['id', 'name', 'email', 'phone', 'avatar', 'address'] },
        {
          model: ProviderProfile,
          as: 'provider',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar', 'phone', 'email'] }],
        },
        { model: Service, as: 'service' },
        { model: Review, as: 'review' },
        { model: Payment, as: 'payment' },
      ],
    });

    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Authorization check
    if (role === 'user' && booking.userId !== userId) {
      throw ApiError.forbidden();
    }
    if (role === 'provider') {
      const provider = await ProviderProfile.findOne({ where: { userId } });
      if (!provider || booking.providerId !== provider.id) {
        throw ApiError.forbidden();
      }
    }

    return booking;
  }

  private static async transitionStatus(
    bookingId: number,
    userId: number,
    role: string,
    newStatus: BookingStatus,
    extras?: { cancelledBy?: string; cancelReason?: string },
  ) {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    // Check if transition is valid
    const allowedTransitions = BOOKING_STATUS_TRANSITIONS[booking.status as BookingStatus];
    if (!allowedTransitions.includes(newStatus)) {
      throw ApiError.badRequest(`Cannot transition from ${booking.status} to ${newStatus}`);
    }

    const updateData: any = { status: newStatus };

    if (newStatus === 'in_progress') {
      updateData.startedAt = new Date();
    }
    if (newStatus === 'completed') {
      updateData.completedAt = new Date();
      updateData.paymentStatus = 'paid';
    }
    if (newStatus === 'cancelled' && extras) {
      updateData.cancelledBy = extras.cancelledBy;
      updateData.cancelReason = extras.cancelReason;
    }

    await booking.update(updateData);

    // Update provider stats on completion
    if (newStatus === 'completed' && booking.providerId) {
      await ProviderProfile.increment('totalJobs', { where: { id: booking.providerId } });
    }

    return booking;
  }

  static async accept(bookingId: number, userId: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) throw ApiError.notFound('Provider profile not found');

    const booking = await Booking.findByPk(bookingId);
    if (!booking) throw ApiError.notFound('Booking not found');

    // Assign provider if not assigned
    if (!booking.providerId) {
      await booking.update({ providerId: provider.id });
    } else if (booking.providerId !== provider.id) {
      throw ApiError.forbidden('This booking is assigned to another provider');
    }

    return this.transitionStatus(bookingId, userId, 'provider', 'accepted');
  }

  static async reject(bookingId: number, userId: number) {
    const provider = await ProviderProfile.findOne({ where: { userId } });
    if (!provider) throw ApiError.notFound('Provider profile not found');

    return this.transitionStatus(bookingId, userId, 'provider', 'rejected');
  }

  static async start(bookingId: number, userId: number) {
    return this.transitionStatus(bookingId, userId, 'provider', 'in_progress');
  }

  static async complete(bookingId: number, userId: number) {
    return this.transitionStatus(bookingId, userId, 'provider', 'completed');
  }

  static async cancel(bookingId: number, userId: number, role: string, reason?: string) {
    return this.transitionStatus(bookingId, userId, role, 'cancelled', {
      cancelledBy: role,
      cancelReason: reason,
    });
  }
}
