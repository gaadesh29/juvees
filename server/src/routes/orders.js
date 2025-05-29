const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isAuthenticated, isAdmin, isRider, isCustomer } = require('../middleware/auth');

const router = express.Router();

// Get all orders (admin only)
router.get('/',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('rider', 'name email')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get rider's assigned orders
router.get('/rider',
  isAuthenticated,
  isRider,
  async (req, res) => {
    try {
      const orders = await Order.find({ rider: req.user._id })
        .populate('user', 'name email')
        .populate('items.product', 'name images')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get user's orders
router.get('/my-orders',
  isAuthenticated,
  isCustomer,
  async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate('items.product', 'name images')
        .populate('rider', 'name email')
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get single order
router.get('/:id',
  isAuthenticated,
  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id)
        .populate('user', 'name email')
        .populate('rider', 'name email')
        .populate('items.product', 'name images');

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if user has permission to view this order
      if (req.user.role !== 'admin' && 
          req.user.role !== 'rider' && 
          order.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create order
router.post('/',
  isAuthenticated,
  isCustomer,
  [
    body('items').isArray().notEmpty(),
    body('items.*.product').isMongoId(),
    body('items.*.variant.color').trim().notEmpty(),
    body('items.*.variant.size').trim().notEmpty(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingAddress').isObject(),
    body('shippingAddress.street').trim().notEmpty(),
    body('shippingAddress.city').trim().notEmpty(),
    body('shippingAddress.state').trim().notEmpty(),
    body('shippingAddress.zipCode').trim().notEmpty(),
    body('shippingAddress.country').trim().notEmpty(),
    body('paymentMethod').isIn(['credit_card', 'debit_card', 'paypal'])
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { items, shippingAddress, paymentMethod } = req.body;
      let totalAmount = 0;

      // Validate products and calculate total
      for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(400).json({ message: `Product ${item.product} not found` });
        }

        const variant = product.variants.find(
          v => v.color === item.variant.color && v.size === item.variant.size
        );

        if (!variant) {
          return res.status(400).json({ message: 'Invalid variant selected' });
        }

        if (variant.stock < item.quantity) {
          return res.status(400).json({ message: 'Insufficient stock' });
        }

        totalAmount += variant.price * item.quantity;
      }

      // Create order
      const order = new Order({
        user: req.user._id,
        items,
        totalAmount,
        shippingAddress,
        paymentMethod
      });

      await order.save();

      // Update product stock
      for (const item of items) {
        const product = await Product.findById(item.product);
        const variant = product.variants.find(
          v => v.color === item.variant.color && v.size === item.variant.size
        );
        variant.stock -= item.quantity;
        await product.save();
      }

      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update order status (admin only)
router.patch('/:id/status',
  isAuthenticated,
  isAdmin,
  [
    body('status').isIn(['paid', 'shipped', 'delivered', 'undelivered', 'cancelled']),
    body('rider').optional().isMongoId()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, rider } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Update status
      order.updateStatus(status);

      // Assign rider if provided
      if (rider && status === 'shipped') {
        order.assignRider(rider);
      }

      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update delivery status (rider only)
router.patch('/:id/delivery',
  isAuthenticated,
  isRider,
  [
    body('status').isIn(['delivered', 'undelivered']),
    body('note').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { status, note } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      // Check if order is assigned to this rider
      if (order.rider.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'This order is not assigned to you' });
      }

      // Update status
      if (status === 'delivered') {
        order.markAsDelivered();
      } else {
        order.markAsUndelivered(note);
      }

      await order.save();

      res.json(order);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router; 