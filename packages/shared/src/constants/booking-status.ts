import type { BookingStatus } from '../types/booking.types';

export const BOOKING_STATUSES: BookingStatus[] = [
  'pending',
  'accepted',
  'rejected',
  'in_progress',
  'completed',
  'cancelled',
];

export const BOOKING_STATUS_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  pending: ['accepted', 'rejected', 'cancelled'],
  accepted: ['in_progress', 'cancelled'],
  rejected: [],
  in_progress: ['completed'],
  completed: [],
  cancelled: [],
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const BOOKING_STATUS_COLORS: Record<BookingStatus, string> = {
  pending: '#F59E0B',
  accepted: '#3B82F6',
  rejected: '#EF4444',
  in_progress: '#8B5CF6',
  completed: '#10B981',
  cancelled: '#6B7280',
};
