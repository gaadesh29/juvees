import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  selectCartItems,
  selectCartTotal,
  clearCart,
} from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { validateShippingAddress, validatePaymentMethod, ValidationError } from '../utils/validation';

interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface PaymentMethod {
  type: 'credit_card' | 'paypal';
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const total = useAppSelector(selectCartTotal);

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>({
    type: 'credit_card',
  });

  const [step, setStep] = useState<'shipping' | 'payment' | 'review'>('shipping');
  const [errors, setErrors] = useState<ValidationError[]>([]);

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateShippingAddress(shippingAddress);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validatePaymentMethod(paymentMethod);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors([]);
    setStep('review');
  };

  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        items: cartItems.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shipping: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.postalCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
        },
        payment: {
          method: paymentMethod.type,
          // In a real app, you would handle payment processing here
        },
      };

      await dispatch(createOrder(orderData)).unwrap();
      dispatch(clearCart());
      navigate('/checkout/success');
    } catch (error) {
      console.error('Failed to place order:', error);
      // Handle error (show error message to user)
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Steps */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'shipping'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Shipping</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'payment'
                      ? 'bg-blue-600 text-white'
                      : step === 'review'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
              <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'review'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Review</span>
              </div>
            </div>

            {/* Shipping Form */}
            {step === 'shipping' && (
              <form onSubmit={handleShippingSubmit}>
                <div className="space-y-4">
                  {errors.map((error) => (
                    <div key={error.field} className="text-red-500 text-sm">
                      {error.message}
                    </div>
                  ))}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          fullName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      required
                      value={shippingAddress.address}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          address: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            city: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        required
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            state: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="postalCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Postal Code
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            postalCode: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Country
                      </label>
                      <input
                        type="text"
                        id="country"
                        required
                        value={shippingAddress.country}
                        onChange={(e) =>
                          setShippingAddress({
                            ...shippingAddress,
                            country: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}

            {/* Payment Form */}
            {step === 'payment' && (
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  {errors.map((error) => (
                    <div key={error.field} className="text-red-500 text-sm">
                      {error.message}
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="credit_card"
                          checked={paymentMethod.type === 'credit_card'}
                          onChange={() =>
                            setPaymentMethod({ type: 'credit_card' })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">Credit Card</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentMethod.type === 'paypal'}
                          onChange={() => setPaymentMethod({ type: 'paypal' })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">PayPal</span>
                      </label>
                    </div>
                  </div>

                  {paymentMethod.type === 'credit_card' && (
                    <>
                      <div>
                        <label
                          htmlFor="cardNumber"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          required
                          value={paymentMethod.cardNumber || ''}
                          onChange={(e) =>
                            setPaymentMethod({
                              ...paymentMethod,
                              cardNumber: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="expiryDate"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            id="expiryDate"
                            required
                            placeholder="MM/YY"
                            value={paymentMethod.expiryDate || ''}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                expiryDate: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="cvv"
                            className="block text-sm font-medium text-gray-700"
                          >
                            CVV
                          </label>
                          <input
                            type="text"
                            id="cvv"
                            required
                            value={paymentMethod.cvv || ''}
                            onChange={(e) =>
                              setPaymentMethod({
                                ...paymentMethod,
                                cvv: e.target.value,
                              })
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Review Order
                  </button>
                </div>
              </form>
            )}

            {/* Order Review */}
            {step === 'review' && (
              <div>
                <div className="space-y-6">
                  {/* Shipping Address Review */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p>{shippingAddress.fullName}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.state}{' '}
                        {shippingAddress.postalCode}
                      </p>
                      <p>{shippingAddress.country}</p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  </div>

                  {/* Payment Method Review */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Payment Method
                    </h3>
                    <div className="bg-gray-50 rounded-md p-4">
                      <p className="capitalize">
                        {paymentMethod.type.replace('_', ' ')}
                      </p>
                      {paymentMethod.type === 'credit_card' && (
                        <p>**** **** **** {paymentMethod.cardNumber?.slice(-4)}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Items Review */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Order Items
                    </h3>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.product._id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center">
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div className="ml-4">
                              <p className="text-sm font-medium text-gray-900">
                                {item.product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-medium text-gray-900">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Order Summary
            </h2>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 