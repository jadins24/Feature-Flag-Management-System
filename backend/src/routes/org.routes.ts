import { Router } from 'express';
import { createOrganization, updateOrganization, listOrganizations } from '../controllers/org.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, requireRole('super_admin'), createOrganization);

router.patch('/:id', requireAuth, requireRole('super_admin'), updateOrganization);

router.get('/', listOrganizations);

export default router;
