const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { validateWeight } = require("../validators/weightValidator");
const {
  addWeight,
  getWeights,
  getWeight,
  updateWeightEntry,
  deleteWeightEntry,
  deleteLastWeightEntry,
} = require("../controllers/weightsController");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Weights:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Weight entry ID
 *         user:
 *           type: string
 *           description: Reference to the User ID
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-09-09
 *         weight:
 *           type: number
 *           example: 75
 */

/**
 * @openapi
 * /weights:
 *   post:
 *     summary: Add a new weight entry
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - weight
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-09
 *               weight:
 *                 type: number
 *                 example: 75
 *     responses:
 *       201:
 *         description: Weight entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weight'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, validateWeight, addWeight);

/**
 * @openapi
 * /weights:
 *   get:
 *     summary: Get weight entries for the logged-in user
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: last
 *         schema:
 *           type: boolean
 *         description: If true, return only the last weight entry
 *     responses:
 *       200:
 *         description: List of weight entries (or last entry if last=true)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weight'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getWeights);

/**
 * @openapi
 * /weights/{id}:
 *   get:
 *     summary: Get a specific weight entry by ID
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weight entry ID
 *     responses:
 *       200:
 *         description: Weight entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weight'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, getWeight);

/**
 * @openapi
 * /weights/{id}:
 *   put:
 *     summary: Update a weight entry by ID
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weight entry ID
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
 *               weight:
 *                 type: number
 *                 example: 75
 *     responses:
 *       200:
 *         description: Weight entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Weight'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.put("/:id", authMiddleware, validateWeight, updateWeightEntry);

/**
 * @openapi
 * /weights/{id}:
 *   delete:
 *     summary: Delete a weight entry by ID
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Weight entry ID
 *     responses:
 *       200:
 *         description: Weight entry deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, deleteWeightEntry);

module.exports = router;
