import { Notification, User, Booking, ProviderProfile } from '../db/models';
import { ApiError } from '../utils/apiError';
import { parsePagination, paginateQuery, buildPaginationMeta } from '../utils/pagination';

/**
 * Mock Push Notification Service
 *
 * In production, this would integrate with:
 * - Firebase Cloud Messaging (FCM) for Android
 * - Apple Push Notification Service (APNs) for iOS
 * - Expo Push Notifications for Expo-managed apps
 *
 * Currently it persists notifications in the DB and logs them
 * to simulate the push notification pipeline.
 */
export class NotificationService {
  /**
   * Send a mock push notification and persist it in DB
   */
  static async send(userId: number, data: { title: string; body: string; type: string; referenceId?: number }) {
    // 1. Persist in database
    const notification = await Notification.create({
      userId,
      title: data.title,
      body: data.body,
      type: data.type,
      referenceId: data.referenceId || null,
    });

    // 2. Mock push: log to console (in production, call FCM/APNs/Expo)
    console.log(`[PUSH NOTIFICATION] → User #${userId}`);
    console.log(`  Title: ${data.title}`);
    console.log(`  Body: ${data.body}`);
    console.log(`  Type: ${data.type}`);

    return notification;
  }

  /**
   * Get notifications for a user
   */
  static async getUserNotifications(userId: number, query: any) {
    const params = parsePagination(query);

    const { count, rows } = await Notification.findAndCountAll({
      where: { userId },
      order: [['created_at', 'DESC']],
      ...paginateQuery(params),
    });

    return {
      data: rows,
      meta: buildPaginationMeta(count, params),
    };
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(userId: number, notificationId: number) {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) throw ApiError.notFound('Notification not found');
    if (notification.userId !== userId) throw ApiError.forbidden();

    await notification.update({ isRead: true });
    return notification;
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: number) {
    await Notification.update({ isRead: true }, { where: { userId, isRead: false } });
    return { message: 'All notifications marked as read' };
  }

  /**
   * Get unread count
   */
  static async getUnreadCount(userId: number) {
    const count = await Notification.count({ where: { userId, isRead: false } });
    return { count };
  }

  // ===== Booking Event Notification Helpers =====

  static async onBookingCreated(booking: Booking) {
    // Notify assigned provider (if any) or all available providers
    if (booking.providerId) {
      const provider = await ProviderProfile.findByPk(booking.providerId, { include: [{ model: User, as: 'user' }] });
      if (provider) {
        await this.send((provider as any).user.id, {
          title: 'New Booking Request',
          body: `You have a new booking request (#${booking.id}) for ${booking.scheduledDate}`,
          type: 'booking_created',
          referenceId: booking.id,
        });
      }
    }
  }

  static async onBookingAccepted(booking: Booking) {
    await this.send(booking.userId, {
      title: 'Booking Accepted',
      body: `Your booking #${booking.id} has been accepted by the provider!`,
      type: 'booking_accepted',
      referenceId: booking.id,
    });
  }

  static async onBookingRejected(booking: Booking) {
    await this.send(booking.userId, {
      title: 'Booking Rejected',
      body: `Unfortunately, your booking #${booking.id} was rejected. Please try another provider.`,
      type: 'booking_rejected',
      referenceId: booking.id,
    });
  }

  static async onBookingStarted(booking: Booking) {
    await this.send(booking.userId, {
      title: 'Service Started',
      body: `The provider has started working on your booking #${booking.id}`,
      type: 'booking_started',
      referenceId: booking.id,
    });
  }

  static async onBookingCompleted(booking: Booking) {
    await this.send(booking.userId, {
      title: 'Service Completed',
      body: `Your booking #${booking.id} has been completed. Please leave a review!`,
      type: 'booking_completed',
      referenceId: booking.id,
    });
  }

  static async onBookingCancelled(booking: Booking, cancelledBy: string) {
    // Notify the other party
    if (cancelledBy === 'user' && booking.providerId) {
      const provider = await ProviderProfile.findByPk(booking.providerId, { include: [{ model: User, as: 'user' }] });
      if (provider) {
        await this.send((provider as any).user.id, {
          title: 'Booking Cancelled',
          body: `Booking #${booking.id} has been cancelled by the customer.`,
          type: 'booking_cancelled',
          referenceId: booking.id,
        });
      }
    } else if (cancelledBy === 'provider') {
      await this.send(booking.userId, {
        title: 'Booking Cancelled',
        body: `Your booking #${booking.id} has been cancelled by the provider.`,
        type: 'booking_cancelled',
        referenceId: booking.id,
      });
    }
  }

  static async onPaymentReceived(booking: Booking, amount: number) {
    // Notify provider about payment
    if (booking.providerId) {
      const provider = await ProviderProfile.findByPk(booking.providerId, { include: [{ model: User, as: 'user' }] });
      if (provider) {
        await this.send((provider as any).user.id, {
          title: 'Payment Received',
          body: `Payment of $${amount} received for booking #${booking.id}`,
          type: 'payment_received',
          referenceId: booking.id,
        });
      }
    }
  }

  static async onReviewReceived(providerId: number, rating: number, bookingId: number) {
    const provider = await ProviderProfile.findByPk(providerId, { include: [{ model: User, as: 'user' }] });
    if (provider) {
      await this.send((provider as any).user.id, {
        title: 'New Review',
        body: `You received a ${rating}-star review for booking #${bookingId}`,
        type: 'review_received',
        referenceId: bookingId,
      });
    }
  }
}
