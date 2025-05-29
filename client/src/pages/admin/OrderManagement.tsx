import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import {
  fetchOrderById,
  updateOrderStatus,
  updateTrackingInfo,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
} from '../../store/slices/orderSlice';
import { notificationService } from '../../services/notificationService';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Order, TrackingInfo } from '../../store/slices/orderSlice';

const OrderManagement: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);
  const [notes, setNotes] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<Partial<TrackingInfo>>({
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
  });

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (orderId) {
      try {
        await dispatch(updateOrderStatus({ orderId, status: newStatus, notes })).unwrap();
        // Send notification
        await notificationService.sendOrderStatusNotification({
          type: 'order_status',
          orderId,
          status: newStatus,
          notes,
        });
        setNotes('');
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }
  };

  const handleTrackingUpdate = async () => {
    if (orderId) {
      try {
        await dispatch(updateTrackingInfo({ orderId, trackingInfo })).unwrap();
        // Send notification
        await notificationService.sendTrackingUpdateNotification({
          type: 'tracking_update',
          orderId,
          trackingInfo,
        });
        setTrackingInfo({
          carrier: '',
          trackingNumber: '',
          estimatedDelivery: '',
        });
      } catch (error) {
        console.error('Failed to update tracking info:', error);
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => orderId && dispatch(fetchOrderById(orderId))}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900">Order Not Found</h2>
          <p className="mt-2 text-gray-600">
            The order you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-blue-600 hover:text-blue-500"
          >
            ← Back to Orders
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Order Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Order #{order.id}
            </p>
          </div>

          <div className="border-t border-gray-200">
            <dl>
              {/* Status Section */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(e.target.value as Order['status'])}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </dd>
              </div>

              {/* Notes Section */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Add Note</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add a note about this order..."
                  />
                </dd>
              </div>

              {/* Tracking Section */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Tracking Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Carrier</label>
                      <input
                        type="text"
                        value={trackingInfo.carrier}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                      <input
                        type="text"
                        value={trackingInfo.trackingNumber}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                      <input
                        type="date"
                        value={trackingInfo.estimatedDelivery}
                        onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDelivery: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    <button
                      onClick={handleTrackingUpdate}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Update Tracking
                    </button>
                  </div>
                </dd>
              </div>

              {/* Order Items Section */}
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Items</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
                      >
                        <div className="w-0 flex-1 flex items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="flex-shrink-0 h-10 w-10 rounded-full"
                          />
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <p className="text-sm font-medium text-gray-900">
                            ${item.price * item.quantity}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Shipping Information</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <p>{order.shipping.address}</p>
                  <p>
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
                  </p>
                  <p>{order.shipping.phone}</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement; 