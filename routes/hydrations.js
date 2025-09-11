const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { validateHydration } = require("../validators/hydrationValidator");
const {
  addHydration,
  getHydrations,
  getHydration,
  updateHydrationEntry,
  deleteHydrationEntry,
} = require("../controllers/hydrationsController");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Hydration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Hydration entry ID
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
 *     summary: Add a new hydration entry
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
 *         description: Hydration entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydration'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 */
router.post("/", authMiddleware, validateHydration, addHydration);

/**
 * @openapi
 * /hydrations:
 *   get:
 *     summary: Get hydration entries for the authenticated user
 *     tags:
 *       - Hydrations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: last
 *         schema:
 *           type: boolean
 *         description: If true, return only the last hydration entry
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           example: today
 *         description: Filter by date (use "today" or a specific date in YYYY-MM-DD format)
 *     responses:
 *       200:
 *         description: List of hydration entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Hydration'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getHydrations);

/**
 * @openapi
 * /hydrations/{id}:
 *   get:
 *     summary: Get a specific hydration entry by ID
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
 *         description: Hydration entry ID
 *     responses:
 *       200:
 *         description: Hydration entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydration'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Hydration entry not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getHydration);

/**
 * @openapi
 * /hydrations/{id}:
 *   put:
 *     summary: Update a hydration entry by ID
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
 *         description: Hydration entry ID
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
 *         description: Hydration entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hydration'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Hydration entry not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, validateHydration, updateHydrationEntry);

/**
 * @openapi
 * /hydrations/{id}:
 *   delete:
 *     summary: Delete a hydration entry by ID
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
 *         description: Hydration entry ID
 *     responses:
 *       200:
 *         description: Hydration entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Hydration entry not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteHydrationEntry);

module.exports = router;