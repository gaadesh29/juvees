import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  fetchProductById,
  selectCurrentProduct,
  selectProductLoading,
  selectProductError,
} from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const product = useAppSelector(selectCurrentProduct);
  const loading = useAppSelector(selectProductLoading);
  const error = useAppSelector(selectProductError);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= (product?.stock || 0)) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ product, quantity }));
      // Optional: Show success message or navigate to cart
      navigate('/cart');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
            <img
              src={product.images[selectedImage]}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg ${
                  selectedImage === index ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-xl ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.numReviews} reviews)
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Quantity and Add to Cart */}
          <div className="mb-6">
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Quantity
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="quantity"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">
                {product.stock} available
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full px-6 py-3 rounded-md text-white font-medium ${
              product.stock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet</p>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="border-b border-gray-200 pb-6">
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-sm ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    by {review.name}
                  </span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails; 