const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, brand, minPrice, maxPrice, color, size } = req.query;
    const query = { isActive: true };

    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (minPrice || maxPrice) {
      query['variants.price'] = {};
      if (minPrice) query['variants.price'].$gte = Number(minPrice);
      if (maxPrice) query['variants.price'].$lte = Number(maxPrice);
    }
    if (color) query['variants.color'] = color;
    if (size) query['variants.size'] = size;

    const products = await Product.find(query)
      .select('name description category brand images variants rating')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('reviews.user', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create product (admin only)
router.post('/',
  isAuthenticated,
  isAdmin,
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('category').isIn(['console', 'accessory', 'game']),
    body('brand').trim().notEmpty(),
    body('images').isArray().notEmpty(),
    body('variants').isArray().notEmpty(),
    body('variants.*.color').trim().notEmpty(),
    body('variants.*.size').trim().notEmpty(),
    body('variants.*.stock').isInt({ min: 0 }),
    body('variants.*.price').isFloat({ min: 0 }),
    body('variants.*.sku').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = new Product(req.body);
      await product.save();

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update product (admin only)
router.put('/:id',
  isAuthenticated,
  isAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim().notEmpty(),
    body('category').optional().isIn(['console', 'accessory', 'game']),
    body('brand').optional().trim().notEmpty(),
    body('images').optional().isArray().notEmpty(),
    body('variants').optional().isArray().notEmpty(),
    body('variants.*.color').optional().trim().notEmpty(),
    body('variants.*.size').optional().trim().notEmpty(),
    body('variants.*.stock').optional().isInt({ min: 0 }),
    body('variants.*.price').optional().isFloat({ min: 0 }),
    body('variants.*.sku').optional().trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Delete product (admin only)
router.delete('/:id',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Add review
router.post('/:id/reviews',
  isAuthenticated,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      const review = {
        user: req.user._id,
        rating: req.body.rating,
        comment: req.body.comment
      };

      product.reviews.push(review);

      // Update average rating
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.rating = totalRating / product.reviews.length;

      await product.save();

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router; 