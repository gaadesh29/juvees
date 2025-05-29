import React, { useState, useEffect } from 'react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProductsStart, setFilters } from '../store/slices/productSlice';

const Products: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error, filters } = useAppSelector(
    (state) => state.product
  );

  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsStart());
  }, [dispatch]);

  const handleFilterChange = (key: string, value: string | number | null) => {
    dispatch(setFilters({ ...filters, [key]: value }));
  };

  const filteredProducts = products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.brand && product.brand !== filters.brand) return false;
    if (filters.minPrice && product.variants[0].price < filters.minPrice)
      return false;
    if (filters.maxPrice && product.variants[0].price > filters.maxPrice)
      return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.variants[0].price - b.variants[0].price;
      case 'price-high':
        return b.variants[0].price - a.variants[0].price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters */}
        <div className="w-full md:w-64">
          <button
            className="md:hidden w-full bg-gray-100 p-4 rounded-lg mb-4"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } md:block space-y-6`}
          >
            {/* Category Filter */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.category || ''}
                onChange={(e) =>
                  handleFilterChange('category', e.target.value || null)
                }
              >
                <option value="">All Categories</option>
                <option value="consoles">Consoles</option>
                <option value="accessories">Accessories</option>
                <option value="games">Games</option>
              </select>
            </div>

            {/* Brand Filter */}
            <div>
              <h3 className="font-semibold mb-2">Brand</h3>
              <select
                className="w-full p-2 border rounded-md"
                value={filters.brand || ''}
                onChange={(e) =>
                  handleFilterChange('brand', e.target.value || null)
                }
              >
                <option value="">All Brands</option>
                <option value="sony">Sony</option>
                <option value="microsoft">Microsoft</option>
                <option value="nintendo">Nintendo</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <h3 className="font-semibold mb-2">Price Range</h3>
              <div className="space-y-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  className="w-full p-2 border rounded-md"
                  value={filters.minPrice || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'minPrice',
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  className="w-full p-2 border rounded-md"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange(
                      'maxPrice',
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Products</h2>
            <select
              className="p-2 border rounded-md"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.brand}</p>
                  <p className="text-primary-600 font-bold">
                    ${product.variants[0].price}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 