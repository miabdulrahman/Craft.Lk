import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.enum(['customer', 'seller']).optional().default('customer'),
  phone: z.string().optional(),
  shopName: z.string().optional(),
  shopDescription: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  phone: z.string().optional(),
  address: z
    .object({
      street: z.string().optional(),
      city: z.string().optional(),
      district: z.string().optional(),
      postalCode: z.string().optional()
    })
    .optional()
});

export const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const errorMessages = result.error.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(', '),
      errors: errorMessages
    });
  }
  req.validatedBody = result.data;
  next();
};
