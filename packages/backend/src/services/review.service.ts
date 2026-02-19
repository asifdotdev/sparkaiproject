import { Review, Booking, ProviderProfile, User } from '../db/models';
import { ApiError } from '../utils/apiError';
import { sequelize } from '../config/database';
import { NotificationService } from './notification.service';

export class ReviewService {
  static async create(userId: number, data: { bookingId: number; rating: number; comment?: string }) {
    const booking = await Booking.findByPk(data.bookingId);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.userId !== userId) {
      throw ApiError.forbidden('You can only review your own bookings');
    }

    if (booking.status !== 'completed') {
      throw ApiError.badRequest('You can only review completed bookings');
    }

    if (!booking.providerId) {
      throw ApiError.badRequest('No provider assigned to this booking');
    }

    const existingReview = await Review.findOne({ where: { bookingId: data.bookingId } });
    if (existingReview) {
      throw ApiError.conflict('Review already exists for this booking');
    }

    const review = await Review.create({
      bookingId: data.bookingId,
      userId,
      providerId: booking.providerId,
      rating: data.rating,
      comment: data.comment || null,
    });

    // Update provider's average rating
    const avgResult = await Review.findOne({
      where: { providerId: booking.providerId },
      attributes: [[sequelize.fn('AVG', sequelize.col('rating')), 'avgRating']],
      raw: true,
    });

    const avgRating = parseFloat((avgResult as any)?.avgRating || '0');
    await ProviderProfile.update(
      { rating: Math.round(avgRating * 100) / 100 },
      { where: { id: booking.providerId } },
    );

    // Notify provider about the review
    NotificationService.onReviewReceived(booking.providerId, data.rating, booking.id).catch(console.error);

    return review;
  }

  static async getByBooking(bookingId: number) {
    const review = await Review.findOne({
      where: { bookingId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });

    if (!review) {
      throw ApiError.notFound('Review not found');
    }

    return review;
  }

  static async getProviderReviews(providerId: number, query: any) {
    const reviews = await Review.findAll({
      where: { providerId },
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
      order: [['created_at', 'DESC']],
      limit: parseInt(query.limit) || 10,
      offset: ((parseInt(query.page) || 1) - 1) * (parseInt(query.limit) || 10),
    });

    return reviews;
  }
}
