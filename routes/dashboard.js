const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { getDashboardData } = require('../controllers/dashboardController');

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
router.get('/', authMiddleware, getDashboardData);

module.exports = router;