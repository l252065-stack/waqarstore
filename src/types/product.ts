export interface ProductVariant {
  id: number;
  productId: number;
  ageRange: string;
  waistSize: string;
  length: string;
  material: string;
  color: string | null;
  fit: string | null;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  category: string;
  imageUrl: string | null;
  variants: ProductVariant[];
}

export interface CatalogFilters {
  search: string;
  ageRange: string;
  waistSize: string;
  length: string;
  material: string;
  minPrice: string;
  maxPrice: string;
}
