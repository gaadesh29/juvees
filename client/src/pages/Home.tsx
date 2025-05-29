import React from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../hooks/useAppSelector';

const Home: React.FC = () => {
  const { products } = useAppSelector((state) => state.product);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-primary-600 text-white rounded-lg p-8 mb-12">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to GameStore
          </h1>
          <p className="text-lg mb-6">
            Your one-stop shop for gaming consoles and accessories. Find the latest
            gaming gear at competitive prices.
          </p>
          <Link
            to="/products"
            className="bg-white text-primary-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
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
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/categories/consoles"
            className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Gaming Consoles</h3>
            <p className="text-gray-600">
              Latest gaming consoles from top brands
            </p>
          </Link>
          <Link
            to="/categories/accessories"
            className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Accessories</h3>
            <p className="text-gray-600">
              Controllers, headsets, and more
            </p>
          </Link>
          <Link
            to="/categories/games"
            className="bg-gray-100 rounded-lg p-6 hover:bg-gray-200 transition-colors"
          >
            <h3 className="text-xl font-semibold mb-2">Games</h3>
            <p className="text-gray-600">
              Popular games for all platforms
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home; 