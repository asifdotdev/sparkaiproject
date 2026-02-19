import { z } from 'zod';

export const createBookingSchema = z.object({
  serviceId: z.number().int().positive(),
  providerId: z.number().int().positive().optional(),
  scheduledDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD format'),
  scheduledTime: z.string().regex(/^\d{2}:\d{2}$/, 'Time must be HH:MM format'),
  address: z.string().min(5, 'Address is required'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  notes: z.string().optional(),
});

export const createReviewSchema = z.object({
  bookingId: z.number().int().positive(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
