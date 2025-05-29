import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppDispatch';
import { selectCurrentOrder } from '../store/slices/orderSlice';

const CheckoutSuccess: React.FC = () => {
  const order = useAppSelector(selectCurrentOrder);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Order not found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find your order details. Please check your order history.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Thank you for your order!
        </h2>
        <p className="text-gray-600 mb-8">
          Your order has been placed successfully. We'll send you an email with
          your order details and tracking information.
        </p>
      </div>

      <div className="mt-12 max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Details
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Order Number</p>
              <p className="mt-1 text-sm text-gray-900">{order._id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Order Date</p>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <p className="mt-1 text-sm text-gray-900">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="mt-1 text-sm text-gray-900 capitalize">
                {order.status}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View Orders
          </Link>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess; 