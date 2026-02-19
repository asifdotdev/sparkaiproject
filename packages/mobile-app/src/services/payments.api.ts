import api from './api';

export const paymentsApi = {
  initiate: (bookingId: number, method: string) =>
    api.post('/payments/initiate', { bookingId, method }).then((res) => res.data),

  confirm: (bookingId: number, gatewayPaymentId?: string) =>
    api.post('/payments/confirm', { bookingId, gatewayPaymentId }).then((res) => res.data),

  getByBooking: (bookingId: number) =>
    api.get(`/payments/booking/${bookingId}`).then((res) => res.data),
};
