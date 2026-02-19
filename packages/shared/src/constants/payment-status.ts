import type { PaymentStatus, TransactionStatus, PaymentMethod } from '../types/booking.types';

export const PAYMENT_STATUSES: PaymentStatus[] = ['pending', 'paid', 'refunded', 'failed'];

export const TRANSACTION_STATUSES: TransactionStatus[] = [
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
];

export const PAYMENT_METHODS: PaymentMethod[] = ['card', 'upi', 'wallet', 'cash', 'net_banking'];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  card: 'Credit/Debit Card',
  upi: 'UPI',
  wallet: 'Wallet',
  cash: 'Cash',
  net_banking: 'Net Banking',
};
