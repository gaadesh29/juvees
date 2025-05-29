import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  fetchOrderById,
  cancelOrder,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
} from '../store/slices/orderSlice';
import { notificationService } from '../services/notificationService';
import { LoadingSpinner } from '../components/LoadingSpinner';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const dispatch = useAppDispatch();
  const order = useAppSelector(selectCurrentOrder);
  const loading = useAppSelector(selectOrderLoading);
  const error = useAppSelector(selectOrderError);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    if (orderId && window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        // Send cancellation notification
        await notificationService.sendOrderCancellationNotification({
          type: 'order_cancellation',
          orderId,
          reason: 'Cancelled by customer',
        });
      } catch (error) {
        console.error('Failed to cancel order:', error);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Order Details</h1>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Order ID: {order._id}</p>
            <p className="text-gray-600">Status: <span className="font-semibold">{order.status}</span></p>
            <p className="text-gray-600">Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          {order.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {order.trackingInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tracking Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Carrier: {order.trackingInfo.carrier}</p>
              <p className="text-gray-600">Tracking Number: {order.trackingInfo.trackingNumber}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Delivery: {order.trackingInfo.estimatedDelivery}</p>
              {order.trackingInfo.notes && (
                <p className="text-gray-600">Notes: {order.trackingInfo.notes}</p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Name: {order.shipping.name}</p>
            <p className="text-gray-600">Address: {order.shipping.address}</p>
            <p className="text-gray-600">City: {order.shipping.city}</p>
          </div>
          <div>
            <p className="text-gray-600">State: {order.shipping.state}</p>
            <p className="text-gray-600">Zip: {order.shipping.zip}</p>
            <p className="text-gray-600">Phone: {order.shipping.phone}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
                <p className="text-gray-600">Price: ${item.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Total Amount:</span>
          <span className="text-2xl font-bold">${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-8">
        <Link
          to="/orders"
          className="text-blue-500 hover:text-blue-600"
        >
          ← Back to Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails; 