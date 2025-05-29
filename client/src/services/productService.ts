import { api } from '../utils/api';
import { Product } from '../store/slices/productSlice';

class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await api.get('/products');
    return response.data;
  }

  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await api.get('/products/categories');
    return response.data;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const response = await api.get(`/products/search?q=${query}`);
    return response.data;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    const response = await api.get(`/products/category/${category}`);
    return response.data;
  }

  async getProductsByPriceRange(min: number, max: number): Promise<Product[]> {
    const response = await api.get(`/products/price-range?min=${min}&max=${max}`);
    return response.data;
  }

  async getProductsByRating(rating: number): Promise<Product[]> {
    const response = await api.get(`/products/rating/${rating}`);
    return response.data;
  }
}

export const productService = new ProductService(); 