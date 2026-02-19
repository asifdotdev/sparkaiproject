export interface ApiResponse<T> {
  success: true;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: 'user' | 'provider';
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface CreateBookingRequest {
  serviceId: number;
  providerId?: number;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  lat?: number;
  lng?: number;
  notes?: string;
}

export interface CreateReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  recentBookings: number;
  activeProviders: number;
}
