import { Router } from 'express';
import {
  createFlag,
  listFlags,
  updateFlag,
  deleteFlag,
  checkFlag,
} from '../controllers/flag.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /flags/check:
 *   post:
 *     summary: Check if a feature flag is enabled (public endpoint)
 *     tags: [Feature Flags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [org_id, feature_key]
 *             properties:
 *               org_id:
 *                 type: string
 *                 format: uuid
 *                 description: Organization ID
 *               feature_key:
 *                 type: string
 *                 description: Feature key to check
 *                 example: dark_mode
 *     responses:
 *       200:
 *         description: Flag status returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 enabled:
 *                   type: boolean
 *       400:
 *         description: Missing org_id or feature_key
 *       404:
 *         description: Organization or feature flag not found
 */
// IMPORTANT: /flags/check must come BEFORE /:id routes to avoid matching "check" as an id
router.post('/check', checkFlag);

/**
 * @swagger
 * /flags:
 *   post:
 *     summary: Create a feature flag (org_admin only)
 *     tags: [Feature Flags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [feature_key]
 *             properties:
 *               feature_key:
 *                 type: string
 *                 example: dark_mode
 *     responses:
 *       201:
 *         description: Flag created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeatureFlag'
 *       400:
 *         description: Missing or invalid feature_key
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Org admin role required
 *       409:
 *         description: Flag key already exists in this org
 */
router.post('/', requireAuth, requireRole('org_admin'), createFlag);

/**
 * @swagger
 * /flags:
 *   get:
 *     summary: List all flags for the admin's organization (org_admin only)
 *     tags: [Feature Flags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of feature flags
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/FeatureFlag'
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Org admin role required
 */
router.get('/', requireAuth, requireRole('org_admin'), listFlags);

/**
 * @swagger
 * /flags/{id}:
 *   patch:
 *     summary: Update a feature flag (toggle or rename) — org_admin only
 *     tags: [Feature Flags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               enabled:
 *                 type: boolean
 *               feature_key:
 *                 type: string
 *     responses:
 *       200:
 *         description: Flag updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FeatureFlag'
 *       400:
 *         description: No valid fields to update
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied — flag belongs to different org
 *       404:
 *         description: Flag not found
 *       409:
 *         description: Duplicate feature_key in org
 */
router.patch('/:id', requireAuth, requireRole('org_admin'), updateFlag);

/**
 * @swagger
 * /flags/{id}:
 *   delete:
 *     summary: Delete a feature flag — org_admin only
 *     tags: [Feature Flags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Flag deleted
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied — flag belongs to different org
 *       404:
 *         description: Flag not found
 */
router.delete('/:id', requireAuth, requireRole('org_admin'), deleteFlag);

export default router;