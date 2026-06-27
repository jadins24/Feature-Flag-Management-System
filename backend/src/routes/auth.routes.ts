import { Router } from 'express';
import { registerOrg, signup, login } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /auth/register/org:
 *   post:
 *     summary: Create organization and first org_admin user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, orgName]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               orgName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization and user created, JWT returned
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/SafeUser'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
router.post('/register/org', registerOrg);

router.post('/signup', signup);

router.post('/login', login);

export default router;
