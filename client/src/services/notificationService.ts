import { api } from './api';
import { Order } from '../store/slices/orderSlice';

interface NotificationData {
  type: 'order_status' | 'tracking_update' | 'order_cancelled';
  orderId: string;
  status?: Order['status'];
  trackingInfo?: {
    carrier: string;
    trackingNumber: string;
    estimatedDelivery?: string;
  };
  notes?: string;
}

class NotificationService {
  async sendOrderStatusNotification(data: NotificationData): Promise<void> {
    await api.post('/notifications/order-status', data);
  }

  async sendTrackingUpdateNotification(data: NotificationData): Promise<void> {
    await api.post('/notifications/tracking-update', data);
  }

  async sendOrderCancelledNotification(data: NotificationData): Promise<void> {
    await api.post('/notifications/order-cancelled', data);
  }
}

export const notificationService = new NotificationService(); 