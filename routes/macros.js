const express = require('express');
const authMiddleware = require('../middlewares/auth');
const { validateMacros } = require('../validators/macrosValidator');
const {
  createMacro,
  getMacros,
  getMacro,
  updateMacroEntry,
  deleteMacroEntry,
} = require('../controllers/macrosController');

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
router.post('/', authMiddleware, validateMacros, createMacro);

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
router.get('/', authMiddleware, getMacros);

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
router.get('/:id', authMiddleware, getMacro);

/**
 * @openapi
 * /macros/{id}:
 *   put:
 *     summary: Update a specific macros entry by ID
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
 *       200:
 *         description: Macros entry updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Macros'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.put('/:id', authMiddleware, validateMacros, updateMacroEntry);

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
router.delete('/:id', authMiddleware, deleteMacroEntry);

module.exports = router;