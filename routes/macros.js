const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { validateMacros } = require('../validators/macrosValidator');
const Macros = require('../models/Macros');

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     Macros:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Macros entry ID
 *         user:
 *           type: string
 *           description: Reference to the User ID
 *         date:
 *           type: string
 *           format: date
 *           example: 2025-09-09
 *         protein:
 *           type: number
 *           example: 150
 *           description: Protein intake in grams
 *         carbs:
 *           type: number
 *           example: 300
 *           description: Carbohydrates intake in grams
 *         fats:
 *           type: number
 *           example: 70
 *           description: Fats intake in grams
 */

/**
 * @openapi
 * /macros:
 *   post:
 *     summary: Add a new macros entry
 *     tags:
 *       - Macros
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - protein
 *               - carbs
 *               - fats
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-09-09
 *               protein:
 *                 type: number
 *                 example: 150
 *                 description: Protein intake in grams
 *               carbs:
 *                 type: number
 *                 example: 300
 *                 description: Carbohydrates intake in grams
 *               fats:
 *                 type: number
 *                 example: 70
 *                 description: Fats intake in grams
 *     responses:
 *       201:
 *         description: Macros entry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Macros'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, validateMacros, async (req, res) => {
  try {
    const { date, protein, carbs, fats } = req.body;

    if (protein == null || carbs == null || fats == null) {
      return res.status(400).json({ message: 'Protein, carbs, and fats are required' });
    }

    const newEntry = new Macros({
      user: req.user.id,
      date: date ? new Date(date) : new Date(),
      protein,
      carbs,
      fats,
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
 * /macros:
 *   get:
 *     summary: Get all macros entries for the authenticated user
 *     tags:
 *       - Macros
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of macros entries
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Macros'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Macros.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

/**
 * @openapi
 * /macros/{id}:
 *   get:
 *     summary: Get a specific macros entry by ID
 *     tags:
 *       - Macros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Macros entry ID
 *     responses:
 *       200:
 *         description: Macros entry retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Macros'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Macros.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Macros entry not found' });
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    res.json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

/**
 * @openapi
 * /macros/{id}:
 *   delete:
 *     summary: Delete a specific macros entry by ID
 *     tags:
 *       - Macros
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Macros entry ID
 *     responses:
 *       200:
 *         description: Macros entry deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Macros entry deleted successfully
 */
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Macros.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: 'Macros entry not found' });
    }
    if (entry.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await entry.remove();
    res.json({ message: 'Macros entry deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
    next(error);
  }
});

module.exports = router;