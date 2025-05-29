import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/useAppDispatch';
import {
  fetchProducts,
  fetchCategories,
  selectProducts,
  selectCategories,
  selectProductLoading,
  selectProductError,
  selectFilters,
  setFilters,
  clearFilters,
} from '../store/slices/productSlice';
import { LoadingSpinner } from '../components/LoadingSpinner';

const ProductList: React.FC = () => {
  const dispatch = useAppDispatch();
  const products = useAppSelector(selectProducts);
  const categories = useAppSelector(selectCategories);
  const loading = useAppSelector(selectProductLoading);
  const error = useAppSelector(selectProductError);
  const filters = useAppSelector(selectFilters);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ searchQuery }));
  };

  const handleCategoryChange = (category: string) => {
    dispatch(setFilters({ category }));
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    dispatch(setFilters({ minPrice: min, maxPrice: max }));
  };

  const handleRatingChange = (rating: number) => {
    dispatch(setFilters({ rating }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    setSearchQuery('');
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filters */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="mb-4">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`block w-full text-left px-2 py-1 rounded ${
                    filters.category === category
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Price Range</h3>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxPrice}
                onChange={(e) => handlePriceRangeChange(0, Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRatingChange(rating)}
                  className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded ${
                    filters.rating === rating
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {[...Array(rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                  {[...Array(5 - rating)].map((_, i) => (
                    <span key={i} className="text-gray-300">★</span>
                  ))}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-400">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
          <p className="mt-2 text-gray-600">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductList; 