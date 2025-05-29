import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  selectCartItems,
  selectCartTotal,
  removeFromCart,
  updateQuantity,
  clearCart,
} from '../store/slices/cartSlice';

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const handleQuantityChange = (productId: string, quantity: number) => {
    if (quantity > 0) {
      dispatch(updateQuantity({ productId, quantity }));
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => (
                <div key={item.product._id} className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-24 h-24">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="hover:text-blue-600"
                          >
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="text-lg font-medium text-gray-900">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center">
                          <label htmlFor={`quantity-${item.product._id}`} className="sr-only">
                            Quantity
                          </label>
                          <select
                            id={`quantity-${item.product._id}`}
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.product._id,
                                parseInt(e.target.value)
                              )
                            }
                            className="rounded-md border-gray-300 py-1.5 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            {[...Array(item.product.stock)].map((_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.product._id)}
                          className="text-sm font-medium text-red-600 hover:text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearCart}
              className="text-sm font-medium text-red-600 hover:text-red-500"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Subtotal</p>
                <p className="text-gray-900 font-medium">${total.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">Shipping</p>
                <p className="text-gray-900 font-medium">Calculated at checkout</p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium text-gray-900">Total</p>
                  <p className="text-lg font-medium text-gray-900">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 