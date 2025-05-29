const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@juvees.com',
      password: adminPassword,
      role: 'admin',
      isApproved: true
    });

    // Create sample products
    const products = await Product.create([
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console with stunning graphics and fast loading times.',
        category: 'console',
        brand: 'Sony',
        images: ['https://example.com/ps5.jpg'],
        variants: [
          {
            color: 'White',
            size: 'Standard',
            stock: 10,
            price: 499.99,
            sku: 'PS5-WHITE'
          }
        ],
        features: ['4K Gaming', 'Ray Tracing', '3D Audio'],
        specifications: {
          'Storage': '825GB SSD',
          'GPU': 'AMD RDNA 2',
          'CPU': 'AMD Zen 2'
        }
      },
      {
        name: 'Xbox Series X',
        description: 'Most powerful Xbox ever with 4K gaming at 60 FPS.',
        category: 'console',
        brand: 'Microsoft',
        images: ['https://example.com/xbox.jpg'],
        variants: [
          {
            color: 'Black',
            size: 'Standard',
            stock: 15,
            price: 499.99,
            sku: 'XBOX-BLACK'
          }
        ],
        features: ['4K Gaming', '120 FPS', 'Quick Resume'],
        specifications: {
          'Storage': '1TB SSD',
          'GPU': 'AMD RDNA 2',
          'CPU': 'AMD Zen 2'
        }
      }
    ]);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase(); 