import type { IUser, IProviderProfile } from './user.types';
import type { IService } from './service.types';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type PaymentMethod = 'card' | 'upi' | 'wallet' | 'cash' | 'net_banking';

export type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';

export interface IBooking {
  id: number;
  userId: number;
  providerId: number | null;
  serviceId: number;
  status: BookingStatus;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  lat: number | null;
  lng: number | null;
  notes: string | null;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  cancelledBy: 'user' | 'provider' | 'admin' | null;
  cancelReason: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  customer?: IUser;
  provider?: IProviderProfile;
  service?: IService;
  review?: IReview;
  payment?: IPayment;
}

export interface IReview {
  id: number;
  bookingId: number;
  userId: number;
  providerId: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  provider?: IProviderProfile;
  booking?: IBooking;
}

export interface IPayment {
  id: number;
  bookingId: number;
  amount: number;
  method: PaymentMethod;
  status: TransactionStatus;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  booking?: IBooking;
}
