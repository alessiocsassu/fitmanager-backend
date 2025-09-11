const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { validateHydration } = require('../validators/hydrationValidator');
const {
  addHydration,
  getHydrations,
  getHydration,
  updateHydrationEntry,
  deleteLastHydrationEntry,
  deleteHydrationEntry,
} = require('../controllers/hydrationsController');

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Hydrations:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Hydrations entry ID
 *         user:
 *           type: string
 *           description: Reference to the User ID
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-09-09
 *         amount:
 *           type: number
 *           example: 2000
 *           description: Amount of water consumed in ml
 */

/**
 * @openapi
 * /hydrations:
 *   post:
 *     summary: Add a new Hydrations entry
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-09
 *               amount:
 *                 type: number
 *                 example: 2000
 *                 description: Amount of water consumed in ml
 *     responses:
 *       201:
 *         description: Hydrations entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydrations'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post('/', authMiddleware, validateHydration, addHydration);

/**
 * @openapi
 * /hydrations:
 *   get:
 *     summary: Get all Hydrations entries for the authenticated user
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Hydrations entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hydrations'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, getHydrations);

/**
 * @openapi
 * /hydrations/{id}:
 *   get:
 *     summary: Get a specific Hydrations entry by ID
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hydrations entry ID
 *     responses:
 *       200:
 *         description: Hydrations entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydrations'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Hydrations entry not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getHydration);

/**
 * @openapi
 * /hydrations/{id}:
 *   put:
 *     summary: Update a Hydrations entry by ID
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hydrations entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-09
 *               amount:
 *                 type: number
 *                 example: 2500
 *                 description: Amount of water consumed in ml
 *     responses:
 *       200:
 *         description: Hydrations entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydrations'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Hydrations entry not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, validateHydration, updateHydrationEntry);

/**
 * @openapi
 * /hydrations:
 *   delete:
 *     summary: Delete last Hydrations entry
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Hydrations entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("", authMiddleware, deleteLastHydrationEntry);

/**
 * @openapi
 * /hydrations/{id}:
 *   delete:
 *     summary: Delete a Hydrations entry by ID
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Hydrations entry ID
 *     responses:
 *       200:
 *         description: Hydrations entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware, deleteHydrationEntry);

module.exports = router;