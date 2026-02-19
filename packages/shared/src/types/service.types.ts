export interface ICategory {
  id: number;
  name: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  services?: IService[];
}

export interface IService {
  id: number;
  categoryId: number;
  name: string;
  description: string | null;
  price: number;
  durationMinutes: number;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
}
