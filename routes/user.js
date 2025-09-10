const express = require("express");
const authMiddleware = require("../middlewares/auth");
const {
  getUser,
  updateUserProfile,
  deleteUserAccount
} = require("../controllers/userController");

const router = express.Router();

/**
 * @openapi
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: User ID
 *         email:
 *           type: string
 *           description: Email of the user
 *         username:
 *           type: string
 *           description: Username
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         sex:
 *           type: string
 *           enum: [M, F, Other]
 *         height:
 *           type: number
 *           description: Height in cm
 *         initialWeight:
 *           type: number
 *         targetWeight:
 *           type: number
 *         workoutsPerWeek:
 *           type: number
 *           description: Number of workouts per week
 */

/**
 * @openapi
 * /user:
 *   get:
 *     summary: Get current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 */
router.get("/", authMiddleware, getUser);

/**
 * @openapi
 * /user:
 *   put:
 *     summary: Update current user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               sex:
 *                 type: string
 *                 enum: [M, F, O]
 *               height:
 *                 type: number
 *               initialWeight:
 *                 type: number
 *               targetWeight:
 *                 type: number
 *               workoutsPerWeek:
 *                 type: number
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request (e.g. username already taken)
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put("/", authMiddleware, updateUserProfile);
/**
 * @openapi
 * /user:
 *   delete:
 *     summary: Delete current user account
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User account deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete("/", authMiddleware, deleteUserAccount);

module.exports = router;
