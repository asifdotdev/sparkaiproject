import { v4 as uuidv4 } from 'uuid';
import { Payment, Booking } from '../db/models';
import { ApiError } from '../utils/apiError';
import { NotificationService } from './notification.service';

/**
 * Mock Payment Gateway Service
 *
 * Simulates a payment gateway (like Stripe/Razorpay) with:
 * - Payment initiation (creates a pending payment)
 * - Payment confirmation (simulates gateway callback)
 * - Refund processing
 *
 * In production, replace mock logic with actual gateway SDK calls.
 */
export class PaymentService {
  /**
   * Step 1: Initiate payment - creates a pending payment record
   * In production: this would create a payment intent with Stripe/Razorpay
   */
  static async initiate(userId: number, data: { bookingId: number; method?: string }) {
    const booking = await Booking.findByPk(data.bookingId);
    if (!booking) {
      throw ApiError.notFound('Booking not found');
    }

    if (booking.userId !== userId) {
      throw ApiError.forbidden();
    }

    const existingPayment = await Payment.findOne({ where: { bookingId: data.bookingId } });
    if (existingPayment && existingPayment.status === 'completed') {
      throw ApiError.conflict('Payment already completed');
    }

    const method = (data.method || 'cash') as any;

    // If payment exists in failed state, allow retry
    if (existingPayment) {
      await existingPayment.update({ method, status: 'processing' });
      return { payment: existingPayment, gatewayOrderId: `ORD_${uuidv4().substring(0, 12).toUpperCase()}` };
    }

    const payment = await Payment.create({
      bookingId: data.bookingId,
      amount: Number(booking.totalPrice),
      method,
      status: 'processing',
      transactionId: null,
      paidAt: null,
    });

    // Mock: return a gateway order ID (in production, this comes from Stripe/Razorpay)
    return {
      payment,
      gatewayOrderId: `ORD_${uuidv4().substring(0, 12).toUpperCase()}`,
    };
  }

  /**
   * Step 2: Confirm payment - simulates gateway webhook/callback
   * In production: this would verify the payment with the gateway
   */
  static async confirm(userId: number, data: { bookingId: number; gatewayPaymentId?: string }) {
    const booking = await Booking.findByPk(data.bookingId);
    if (!booking) throw ApiError.notFound('Booking not found');
    if (booking.userId !== userId) throw ApiError.forbidden();

    const payment = await Payment.findOne({ where: { bookingId: data.bookingId } });
    if (!payment) throw ApiError.notFound('No payment initiated for this booking');
    if (payment.status === 'completed') throw ApiError.conflict('Payment already completed');

    // Mock: simulate 95% success rate
    const isSuccess = Math.random() < 0.95;

    if (isSuccess) {
      const transactionId = data.gatewayPaymentId || `TXN_${uuidv4().substring(0, 12).toUpperCase()}`;
      await payment.update({
        status: 'completed',
        transactionId,
        paidAt: new Date(),
      });
      await booking.update({ paymentStatus: 'paid' });

      // Send notification to provider
      NotificationService.onPaymentReceived(booking, Number(payment.amount)).catch(console.error);

      return { payment, success: true, message: 'Payment successful' };
    } else {
      await payment.update({ status: 'failed' });
      await booking.update({ paymentStatus: 'failed' });
      return { payment, success: false, message: 'Payment failed. Please try again.' };
    }
  }

  /**
   * Refund a completed payment
   */
  static async refund(paymentId: number) {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) throw ApiError.notFound('Payment not found');
    if (payment.status !== 'completed') throw ApiError.badRequest('Only completed payments can be refunded');

    // Mock refund processing
    await payment.update({ status: 'refunded' });
    await Booking.update({ paymentStatus: 'refunded' }, { where: { id: payment.bookingId } });

    return { payment, message: 'Refund processed successfully' };
  }

  static async getByBooking(bookingId: number) {
    const payment = await Payment.findOne({ where: { bookingId } });
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }
    return payment;
  }

  static async getById(id: number) {
    const payment = await Payment.findByPk(id, {
      include: [{ model: Booking, as: 'booking' }],
    });
    if (!payment) {
      throw ApiError.notFound('Payment not found');
    }
    return payment;
  }
}
