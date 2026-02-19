import { v4 as uuidv4 } from 'uuid';
import { Payment, Booking } from '../db/models';
import { ApiError } from '../utils/apiError';

export class PaymentService {
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

    // Mock payment processing
    const transactionId = `TXN_${uuidv4().substring(0, 12).toUpperCase()}`;
    const method = (data.method || 'cash') as any;

    const payment = existingPayment
      ? await existingPayment.update({
          method,
          status: 'completed',
          transactionId,
          paidAt: new Date(),
        })
      : await Payment.create({
          bookingId: data.bookingId,
          amount: Number(booking.totalPrice),
          method,
          status: 'completed',
          transactionId,
          paidAt: new Date(),
        });

    // Update booking payment status
    await booking.update({ paymentStatus: 'paid' });

    return payment;
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
