import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { useFormValidation } from '../hooks/useFormValidation';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { createOrder } from '../store/slices/orderSlice';
import { clearCart } from '../store/slices/cartSlice';
import * as validation from '../utils/validation';

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const initialValues = {
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    phone: user?.phone || '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  };

  const validationRules = {
    address: { required: true },
    city: { required: true },
    state: { required: true },
    zipCode: { required: true, custom: validation.validateZipCode },
    phone: { required: true, custom: validation.validatePhoneNumber },
    cardNumber: { required: true, custom: validation.validateCardNumber },
    cardName: { required: true },
    expiryDate: { required: true, custom: validation.validateExpiryDate },
    cvv: { required: true, custom: validation.validateCVV },
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateForm,
  } = useFormValidation(initialValues);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm(validationRules)) {
      try {
        const orderData = {
          items,
          shipping: {
            address: values.address,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode,
            phone: values.phone,
          },
          payment: {
            cardNumber: values.cardNumber,
            cardName: values.cardName,
            expiryDate: values.expiryDate,
            cvv: values.cvv,
          },
        };

        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        navigate('/checkout/success');
      } catch (error) {
        // Error is handled by the order slice
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
          <p className="mt-2 text-gray-600">
            Add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
          {/* Shipping and Payment Forms */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Shipping Information */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Shipping Information
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Street address
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={values.address}
                          onChange={(e) => handleChange(e, validationRules.address)}
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.address && touched.address
                              ? 'border-red-300'
                              : ''
                          }`}
                        />
                        {errors.address && touched.address && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.address}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700"
                      >
                        City
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={values.city}
                          onChange={(e) => handleChange(e, validationRules.city)}
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.city && touched.city ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.city && touched.city && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.city}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-gray-700"
                      >
                        State
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={values.state}
                          onChange={(e) => handleChange(e, validationRules.state)}
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.state && touched.state ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.state && touched.state && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.state}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label
                        htmlFor="zipCode"
                        className="block text-sm font-medium text-gray-700"
                      >
                        ZIP code
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="zipCode"
                          id="zipCode"
                          value={values.zipCode}
                          onChange={(e) =>
                            handleChange(e, validationRules.zipCode)
                          }
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.zipCode && touched.zipCode
                              ? 'border-red-300'
                              : ''
                          }`}
                        />
                        {errors.zipCode && touched.zipCode && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone number
                      </label>
                      <div className="mt-1">
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          value={values.phone}
                          onChange={(e) => handleChange(e, validationRules.phone)}
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.phone && touched.phone ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.phone && touched.phone && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Payment Information
                  </h3>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Card number
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cardNumber"
                          id="cardNumber"
                          value={values.cardNumber}
                          onChange={(e) =>
                            handleChange(e, validationRules.cardNumber)
                          }
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.cardNumber && touched.cardNumber
                              ? 'border-red-300'
                              : ''
                          }`}
                        />
                        {errors.cardNumber && touched.cardNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.cardNumber}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-6">
                      <label
                        htmlFor="cardName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name on card
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cardName"
                          id="cardName"
                          value={values.cardName}
                          onChange={(e) =>
                            handleChange(e, validationRules.cardName)
                          }
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.cardName && touched.cardName
                              ? 'border-red-300'
                              : ''
                          }`}
                        />
                        {errors.cardName && touched.cardName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.cardName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Expiry date
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="expiryDate"
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={values.expiryDate}
                          onChange={(e) =>
                            handleChange(e, validationRules.expiryDate)
                          }
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.expiryDate && touched.expiryDate
                              ? 'border-red-300'
                              : ''
                          }`}
                        />
                        {errors.expiryDate && touched.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3">
                      <label
                        htmlFor="cvv"
                        className="block text-sm font-medium text-gray-700"
                      >
                        CVV
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="cvv"
                          id="cvv"
                          value={values.cvv}
                          onChange={(e) => handleChange(e, validationRules.cvv)}
                          onBlur={handleBlur}
                          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
                            errors.cvv && touched.cvv ? 'border-red-300' : ''
                          }`}
                        />
                        {errors.cvv && touched.cvv && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Place Order
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Order Summary
                </h3>
                <div className="mt-6">
                  <div className="flow-root">
                    <ul className="-my-5 divide-y divide-gray-200">
                      {items.map((item) => (
                        <li key={item.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                className="h-16 w-16 rounded-md object-cover"
                                src={item.image}
                                alt={item.name}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="flex-shrink-0">
                              <p className="text-sm font-medium text-gray-900">
                                ${item.price * item.quantity}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <p>Subtotal</p>
                      <p>${total}</p>
                    </div>
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <p>Shipping</p>
                        <p>Free</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-base font-medium text-gray-900">
                        <p>Total</p>
                        <p>${total}</p>
                      </div>
                    </div>
                  </div>
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