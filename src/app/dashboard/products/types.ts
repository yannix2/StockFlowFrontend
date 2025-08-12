export type ProductStatus = 'publish' | 'draft' | 'pending' | 'private';
export type ProductType = 'simple' | 'variable' | 'grouped' | 'external';
export type StockStatus = 'instock' | 'outofstock' | 'onbackorder';

export interface ProductDimensions {
  length?: number;
  width?: number;
  height?: number;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  regularPrice?: number;
  salePrice?: number;
  type: ProductType;
  status: ProductStatus;
  stockQuantity?: number;
  stockStatus: StockStatus;
  manageStock: boolean;
  weight?: string;
  dimensions?: ProductDimensions;
  categories: string[];
  tags: string[];
  images: string[];
  attributes: Record<string, any>;
  variations: any[];
  purchaseNote?: string;
  soldIndividually: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductStats {
  totalProducts: number;
  published: number;
  outOfStock: number;
  totalValue: number;
  averagePrice: number;
}