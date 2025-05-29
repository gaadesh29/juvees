import { api } from './api';
import type { Order, OrderItem, ShippingInfo, PaymentInfo, TrackingInfo } from '../store/slices/orderSlice';

export interface CreateOrderData {
  items: OrderItem[];
  shipping: ShippingInfo;
  payment: PaymentInfo;
}

class OrderService {
  async createOrder(data: CreateOrderData): Promise<Order> {
    const response = await api.post('/orders', data);
    return response.data;
  }

  async getOrders(): Promise<Order[]> {
    const response = await api.get('/orders');
    return response.data;
  }

  async getOrderById(id: string): Promise<Order> {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }

  async cancelOrder(id: string): Promise<Order> {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  }

  async updateOrderStatus(
    id: string,
    status: Order['status'],
    notes?: string
  ): Promise<Order> {
    const response = await api.patch(`/orders/${id}/status`, { status, notes });
    return response.data;
  }

  async updateTrackingInfo(
    id: string,
    trackingInfo: Partial<TrackingInfo>
  ): Promise<Order> {
    const response = await api.patch(`/orders/${id}/tracking`, trackingInfo);
    return response.data;
  }

  async getOrderTracking(id: string): Promise<TrackingInfo> {
    const response = await api.get(`/orders/${id}/tracking`);
    return response.data;
  }
}

export const orderService = new OrderService(); 