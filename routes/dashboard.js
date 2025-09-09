const express = require('express');
const authMiddleware = require('../middlewares/auth');
const User = require('../models/User');
const Weights = require('../models/Weights');
const Macros = require('../models/Macros');
const Hydrations = require('../models/Hydrations');
const { route } = require('./hydrations');

const router = express.Router();

/**
 * @openapi
 * /dashboard:
 *   get:
 *     summary: Get dashboard data (user profile, latest weight, macros, hydration)
 *     tags:
 *       - Dashboard
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 latestWeight:
 *                   $ref: '#/components/schemas/Weights'
 *                 latestMacros:
 *                   $ref: '#/components/schemas/Macros'
 *                 latestHydration:
 *                   $ref: '#/components/schemas/Hydrations'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    // Fetch user profile
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch latest weight entry
    const latestWeight = await Weights.findOne({ user: userId }).sort({ date: -1 });

    // Fetch latest macros entry
    const latestMacros = await Macros.findOne({ user: userId }).sort({ date: -1 });

    // Fetch latest hydration entry
    const latestHydration = await Hydrations.findOne({ user: userId }).sort({ date: -1 });

    res.json({
      user,
      latestWeight,
      latestMacros,
      latestHydration,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

module.exports = router;