import api from './api';

export const reviewsApi = {
  create: (data: { bookingId: number; rating: number; comment?: string }) =>
    api.post('/reviews', data).then((res) => res.data),

  getByBooking: (bookingId: number) =>
    api.get(`/reviews/booking/${bookingId}`).then((res) => res.data),

  getProviderReviews: (providerId: number, params?: { page?: number; limit?: number }) =>
    api.get(`/reviews/provider/${providerId}`, { params }).then((res) => res.data),
};
