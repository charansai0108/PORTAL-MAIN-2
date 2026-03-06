/**
 * Public Routes
 * NO authentication required - public access endpoints
 */

import express from 'express';
import * as publicProfileController from '../controllers/publicProfile.js';
import * as tenantController from '../controllers/tenants.js';
import rateLimit from 'express-rate-limit';

const router = express.Router({ mergeParams: true });

// Rate limiting for public endpoints
const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Public profile access (NO AUTH)
router.get('/profile/:publicProfileId',
  publicRateLimit,
  publicProfileController.getPublicProfile
);

// Public tenant info (NO AUTH)
router.get('/tenant/:slug',
  publicRateLimit,
  tenantController.getPublicTenantInfo
);

export default router;
