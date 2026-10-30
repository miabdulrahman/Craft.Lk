import { z } from 'zod';

export const productCreateSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category ID is required'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  images: z.array(z.string()).min(1, 'At least one image is required').optional(),
  badges: z.array(z.string()).optional()
});

export const productUpdateSchema = z.object({
  name: z.string().min(3).max(150).optional(),
  description: z.string().min(10).optional(),
  price: z.coerce.number().min(1).optional(),
  category: z.string().optional(),
  stock: z.coerce.number().int().min(0).optional(),
  images: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  isActive: z.boolean().optional()
});
