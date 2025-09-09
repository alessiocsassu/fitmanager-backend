const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { validateHydration } = require('../validators/hydrationValidator');
const Hydrations = require('../models/Hydrations');

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
 * /Hydrations:
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
router.post('/', authMiddleware, validateHydration, async (req, res) => {
  try {
    const { date, amount } = req.body;
    if (!date || !amount) {
      return res.status(400).json({ message: 'Date and amount are required' });
    }

    const newEntry = new Hydrations({
      user: req.user.id,
      date: new Date(date),
      amount,
    });

    await newEntry.save();
    res.status(201).json(newEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

/**
 * @openapi
 * /Hydrations:
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
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Hydrations.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

/**
 * @openapi
 * /Hydrations/{id}:
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
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const entry = await Hydrations.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Hydrations entry not found" });
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
 * /Hydrations/{id}:
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
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Hydrations.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Hydrations entry not found' });
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await entry.remove();
    res.json({ message: 'Hydrations entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

module.exports = router;