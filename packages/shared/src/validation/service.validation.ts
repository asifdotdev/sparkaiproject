import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().optional(),
  image: z.string().url().optional(),
  sortOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const createServiceSchema = z.object({
  categoryId: z.number().int().positive(),
  name: z.string().min(2, 'Name must be at least 2 characters').max(150),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  durationMinutes: z.number().int().positive().default(60),
  image: z.string().url().optional(),
  isActive: z.boolean().optional(),
});

export const updateServiceSchema = createServiceSchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
