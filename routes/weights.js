const express = require("express");
const authMiddleware = require("../middlewares/auth");
const { validateWeight } = require("../validators/weightValidator");
const Weights = require("../models/Weights");

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
 *               $ref: '#/components/schemas/Weights'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", authMiddleware, validateWeight, async (req, res) => {
  const { date, weight } = req.body;
  try {
    const newEntry = new Weights({
      user: req.user.id || req.user._id,
      date,
      weight,
    });
    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
});

/**
 * @openapi
 * /weights:
 *   get:
 *     summary: Get all weight entries for the logged-in user
 *     tags:
 *       - Weights
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of weight entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Weights'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const entries = await Weights.find({
      user: req.user.id || req.user._id,
    }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
});

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
 *               $ref: '#/components/schemas/Weights'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Weights.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Weight entry not found" });
    }
    if (entry.user.toString() !== (req.user.id || req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
});

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
 *       403:
 *         description: Forbidden (trying to delete another user's entry)
 *       404:
 *         description: Weight entry not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Weights.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Weight entry not found" });
    }
    if (entry.user.toString() !== (req.user.id || req.user._id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await entry.remove();
    res.json({ message: "Weight entry deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    next(error);
  }
});

module.exports = router;
