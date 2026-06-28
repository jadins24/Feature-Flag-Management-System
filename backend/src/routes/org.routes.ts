import { Router } from 'express';
import { createOrganization, updateOrganization, listOrganizations, listOrgAdmins, getOrgAdmin } from '../controllers/org.controller';
import { requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.post('/', requireAuth, requireRole('super_admin'), createOrganization);

router.patch('/:id', requireAuth, requireRole('super_admin'), updateOrganization);

router.get('/', listOrganizations);

router.get('/admins', requireAuth, requireRole('super_admin'), listOrgAdmins);

router.get('/admins/:id', requireAuth, requireRole('super_admin'), getOrgAdmin);

export default router;
