import api from './api';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string[];
  variants: {
    color: string;
    size: string;
    stock: number;
    price: number;
    sku: string;
  }[];
  rating: number;
  reviews: {
    user: {
      id: string;
      name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
}

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products', { params: filters });
    return response.data;
  },

  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  getCategories: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/categories');
    return response.data;
  },

  getBrands: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/brands');
    return response.data;
  },

  addReview: async (
    productId: string,
    review: { rating: number; comment: string }
  ): Promise<Product> => {
    const response = await api.post<Product>(`/products/${productId}/reviews`, review);
    return response.data;
  },
}; 