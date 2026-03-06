/**
 * Tenant Controller
 * CRUD for organizations/tenants
 */

import prisma from '../config/database.js';
import logger from '../config/logger.js';

/**
 * List all tenants (Super Admin only)
 */
export async function listTenants(req, res) {
    try {
        const tenants = await prisma.tenant.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: {
                        users: true,
                        jobs: true,
                        students: true
                    }
                }
            }
        });
        res.json({ tenants });
    } catch (error) {
        logger.error('List tenants error:', error);
        res.status(500).json({ error: 'Failed to list tenants' });
    }
}

/**
 * Create a new tenant
 */
export async function createTenant(req, res) {
    try {
        const { name, slug, domain, settings } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and slug are required' });
        }

        const existing = await prisma.tenant.findFirst({
            where: {
                OR: [
                    { name },
                    { slug }
                ]
            }
        });

        if (existing) {
            return res.status(400).json({ error: 'Tenant with this name or slug already exists' });
        }

        const tenant = await prisma.tenant.create({
            data: {
                name,
                slug: slug.toLowerCase(),
                domain: domain?.toLowerCase(),
                settings: settings || '{}'
            }
        });

        res.status(201).json({ tenant });
    } catch (error) {
        logger.error('Create tenant error:', error);
        res.status(500).json({ error: 'Failed to create tenant' });
    }
}

/**
 * Get tenant details
 */
export async function getTenant(req, res) {
    try {
        const { id } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { id }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({ tenant });
    } catch (error) {
        logger.error('Get tenant error:', error);
        res.status(500).json({ error: 'Failed to fetch tenant' });
    }
}

/**
 * Update tenant (Owner or Landlord)
 */
export async function updateTenant(req, res) {
    try {
        const { id } = req.params;
        const { name, domain, logo, banner, themeColor, allowedDomains, status, settings } = req.body;

        const existing = await prisma.tenant.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        // Only Boss of College (Owner) or Boss of Platform (Super Admin) can update
        if (req.user.role !== 'SUPER_ADMIN' && existing.ownerId !== req.userId) {
            return res.status(403).json({ error: 'Unauthorized: Only the community owner can update settings' });
        }

        const data = {
            name,
            domain: domain?.toLowerCase(),
            logo,
            banner,
            themeColor,
            allowedDomains,
            settings: settings ? (typeof settings === 'string' ? settings : JSON.stringify(settings)) : undefined
        };

        // Only Landlord can change status
        if (req.user.role === 'SUPER_ADMIN' && status) {
            data.status = status;
        }

        const tenant = await prisma.tenant.update({
            where: { id },
            data
        });

        // If tenant status changed, sync owner user status (only SUPER_ADMIN can change status)
        if (status && existing.ownerId) {
            try {
                const ownerStatus = status === 'ACTIVE' ? 'ACTIVE' : 'PENDING';
                await prisma.user.update({
                    where: { id: existing.ownerId },
                    data: { status: ownerStatus }
                });
            } catch (err) {
                logger.error('Failed to sync tenant owner status after tenant update:', err);
            }
        }

        res.json({ tenant });
    } catch (error) {
        logger.error('Update tenant error:', error);
        res.status(500).json({ error: 'Failed to update tenant' });
    }
}

/**
 * Get public tenant info by slug
 */
export async function getPublicTenantInfo(req, res) {
    try {
        const { slug } = req.params;
        const tenant = await prisma.tenant.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                logo: true,
                banner: true,
                themeColor: true,
                settings: true
            }
        });

        if (!tenant) {
            return res.status(404).json({ error: 'Tenant not found' });
        }

        res.json({ tenant });
    } catch (error) {
        logger.error('Public tenant info error:', error);
        res.status(500).json({ error: 'Failed to fetch public tenant info' });
    }
}
