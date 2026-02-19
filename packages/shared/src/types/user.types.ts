export interface IUser {
  id: number;
  roleId: number;
  name: string;
  email: string;
  phone: string | null;
  password?: string;
  avatar: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  isActive: boolean;
  emailVerifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  role?: IRole;
  providerProfile?: IProviderProfile;
}

export interface IRole {
  id: number;
  name: 'user' | 'provider' | 'admin';
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IProviderProfile {
  id: number;
  userId: number;
  bio: string | null;
  experienceYears: number;
  rating: number;
  totalJobs: number;
  isAvailable: boolean;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  services?: IService[];
}

export interface IProviderService {
  id: number;
  providerId: number;
  serviceId: number;
  customPrice: number | null;
  createdAt: string;
}

import type { IService } from './service.types';
