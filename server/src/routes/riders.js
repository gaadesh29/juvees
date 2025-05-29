const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all riders (admin only)
router.get('/',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const riders = await User.find({ role: 'rider' })
        .select('-password')
        .sort({ name: 1 });

      res.json(riders);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get rider's performance stats (admin only)
router.get('/:id/stats',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const rider = await User.findById(req.params.id);
      if (!rider || rider.role !== 'rider') {
        return res.status(404).json({ message: 'Rider not found' });
      }

      const orders = await Order.find({ rider: rider._id });
      const stats = {
        totalDeliveries: orders.length,
        successfulDeliveries: orders.filter(o => o.status === 'delivered').length,
        failedDeliveries: orders.filter(o => o.status === 'undelivered').length,
        averageDeliveryTime: 0, // Calculate based on your requirements
        currentActiveDeliveries: orders.filter(o => o.status === 'shipped').length
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Create new rider (admin only)
router.post('/',
  isAuthenticated,
  isAdmin,
  [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().notEmpty(),
    body('phone').trim().notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, name, phone } = req.body;

      // Check if user already exists
      let rider = await User.findOne({ email });
      if (rider) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new rider
      rider = new User({
        email,
        name,
        phone,
        role: 'rider',
        isApproved: true // Auto-approve riders
      });

      await rider.save();

      res.status(201).json({
        message: 'Rider created successfully',
        rider: {
          id: rider._id,
          email: rider.email,
          name: rider.name,
          phone: rider.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Update rider (admin only)
router.put('/:id',
  isAuthenticated,
  isAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('phone').optional().trim().notEmpty(),
    body('isActive').optional().isBoolean()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const rider = await User.findById(req.params.id);
      if (!rider || rider.role !== 'rider') {
        return res.status(404).json({ message: 'Rider not found' });
      }

      // Update fields
      if (req.body.name) rider.name = req.body.name;
      if (req.body.phone) rider.phone = req.body.phone;
      if (req.body.isActive !== undefined) rider.isApproved = req.body.isActive;

      await rider.save();

      res.json({
        message: 'Rider updated successfully',
        rider: {
          id: rider._id,
          email: rider.email,
          name: rider.name,
          phone: rider.phone,
          isActive: rider.isApproved
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// Get available riders for assignment (admin only)
router.get('/available',
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const riders = await User.find({
        role: 'rider',
        isApproved: true
      }).select('-password');

      // Get active deliveries for each rider
      const ridersWithActiveDeliveries = await Promise.all(
        riders.map(async (rider) => {
          const activeDeliveries = await Order.countDocuments({
            rider: rider._id,
            status: 'shipped'
          });
          return {
            ...rider.toObject(),
            activeDeliveries
          };
        })
      );

      // Sort by number of active deliveries
      ridersWithActiveDeliveries.sort((a, b) => a.activeDeliveries - b.activeDeliveries);

      res.json(ridersWithActiveDeliveries);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router; 