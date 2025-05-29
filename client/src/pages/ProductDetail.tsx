import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { setSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.product
  );

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      dispatch(setSelectedProduct(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(
        addToCart({
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.variants[selectedVariant].price,
          quantity,
          image: selectedProduct.images[0],
          variant: selectedProduct.variants[selectedVariant],
        })
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error || !selectedProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <img
            src={selectedProduct.images[0]}
            alt={selectedProduct.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <div className="grid grid-cols-4 gap-4">
            {selectedProduct.images.slice(1).map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${selectedProduct.name} ${index + 2}`}
                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75"
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{selectedProduct.name}</h1>
            <p className="text-gray-600">{selectedProduct.brand}</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-primary-600">
              ${selectedProduct.variants[selectedVariant].price}
            </h2>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{selectedProduct.description}</p>
          </div>

          {/* Variants */}
          <div>
            <h3 className="font-semibold mb-2">Select Variant</h3>
            <div className="grid grid-cols-2 gap-4">
              {selectedProduct.variants.map((variant, index) => (
                <button
                  key={index}
                  className={`p-4 border rounded-lg ${
                    selectedVariant === index
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setSelectedVariant(index)}
                >
                  <p className="font-semibold">{variant.name}</p>
                  <p className="text-gray-600">${variant.price}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="font-semibold mb-2">Quantity</h3>
            <div className="flex items-center space-x-4">
              <button
                className="w-8 h-8 border rounded-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                className="w-8 h-8 border rounded-md"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="w-full bg-primary-600 text-white py-3 rounded-md hover:bg-primary-700"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 