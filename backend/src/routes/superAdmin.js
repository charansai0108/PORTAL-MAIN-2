/**
 * Super Admin Routes
 * Create/disable admins, stats by center/department/admin
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { requireRole } from '../middleware/roles.js';
import {
  listAdmins,
  createAdmin,
  disableAdmin,
  enableAdmin,
  getPlatformStats,
  getStatsSummary,
} from '../controllers/superAdmin.js';
import {
  listTenants,
  createTenant,
  getTenant,
  updateTenant
} from '../controllers/tenants.js';

const router = express.Router({ mergeParams: true });

router.use(authenticate);
// We don't apply global requireRole here because some routes are for TENANT_SUPER_ADMIN too

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Admin Management (College Super Admin can manage their staff, Landlord can manage all)
router.get('/admins', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), listAdmins);
router.post(
  '/admins',
  requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('displayName').optional().trim(),
  handleValidation,
  createAdmin
);
router.patch('/admins/:userId/disable', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), disableAdmin);
router.patch('/admins/:userId/enable', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), enableAdmin);

// Stats
router.get('/stats/summary', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN', 'ADMIN']), getStatsSummary);
router.get('/stats/platform', requireRole(['SUPER_ADMIN']), getPlatformStats);

// Tenant Management (Global)
router.get('/tenants', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), listTenants);
router.post('/tenants', requireRole(['SUPER_ADMIN']), createTenant);
router.get('/tenants/:id', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), getTenant);
router.patch('/tenants/:id', requireRole(['SUPER_ADMIN', 'TENANT_SUPER_ADMIN']), updateTenant);

export default router;
