import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().min(0.01, { message: "Price must be at least $0.01" }),

  regularPrice: z.number().min(0).optional(),
  salePrice: z.number().min(0).optional(),

  type: z.enum(["simple", "variable", "grouped", "external"]),
  status: z.enum(["publish", "draft", "pending", "private"]),
  stockQuantity: z.number().min(0).optional(),
  stockStatus: z.enum(["instock", "outofstock", "onbackorder"]),
  manageStock: z.boolean(),
  weight: z.string().optional(),

  dimensions: z
    .object({
      length: z.string().optional(),
      width: z.string().optional(),
      height: z.string().optional(),
    })
    .optional(),

  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  attributes: z.record(z.string(), z.any()).optional(),
  variations: z.array(z.any()).optional(),
  purchaseNote: z.string().optional(),
  soldIndividually: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
