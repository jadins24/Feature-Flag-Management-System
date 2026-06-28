import { Router } from 'express';
import { registerOrg, registerEndUser, signup, login, createEndUser, listOrgUsers } from '../controllers/auth.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/register/org', registerOrg);

router.post('/register/user', registerEndUser);

router.post('/signup', signup);

router.post('/login', login);

router.post('/users', requireAuth, requireRole('org_admin'), createEndUser);

router.get('/users', requireAuth, requireRole('org_admin'), listOrgUsers);

export default router;
