import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  sku: z.string().min(1, { message: 'SKU is required' }),
  price: z.number().min(0.01, { message: 'Price must be at least $0.01' }),
  regularPrice: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),
  type: z.enum(['simple', 'variable', 'grouped', 'external']).default('simple'),
  status: z.enum(['publish', 'draft', 'pending', 'private']).default('publish'),
  stockQuantity: z.number().min(0).optional(),
  stockStatus: z.enum(['instock', 'outofstock', 'onbackorder']).default('instock'),
  manageStock: z.boolean().default(false),
  weight: z.string().optional(),
  dimensions: z.object({
    length: z.string().optional(),
    width: z.string().optional(),
    height: z.string().optional(),
  }).optional(),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  attributes: z.record(z.any()).default({}),
  variations: z.array(z.any()).default([]),
  purchaseNote: z.string().optional(),
  soldIndividually: z.boolean().default(false),
});

export type ProductFormValues = z.infer<typeof productSchema>;