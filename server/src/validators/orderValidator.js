import { z } from 'zod';

export const orderCreateSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().min(1, 'Quantity must be at least 1')
      })
    )
    .min(1, 'Order must contain at least 1 product'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Recipient full name is required'),
    phone: z.string().min(7, 'Contact phone number is required'),
    address: z.string().min(5, 'Delivery address is required'),
    city: z.string().min(2, 'City is required'),
    district: z.string().min(2, 'District is required'),
    notes: z.string().optional()
  }),
  paymentMethod: z.enum(['cod', 'simulated'])
});

export const orderStatusUpdateSchema = z.object({
  orderStatus: z.enum([
    'Pending',
    'Confirmed',
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled'
  ]),
  cancellationReason: z.string().optional()
});
