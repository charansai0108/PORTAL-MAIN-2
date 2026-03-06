/**
 * Tenant Resolver Middleware
 * Reads X-Tenant-Slug (or x-tenant-slug) header from incoming requests
 * and resolves it to a tenantId, attaching req.tenantId for downstream handlers.
 *
 * Non-fatal: if header missing or tenant not found, middleware leaves req.tenantId unchanged.
 */
import prisma from '../config/database.js';

export async function resolveTenantFromHeader(req, res, next) {
  try {
    const header = req.headers['x-tenant-slug'] || req.headers['x-tenant'];
    if (!header) return next();

    const slug = String(header).trim().toLowerCase();
    if (!slug) return next();

    const tenant = await prisma.tenant.findFirst({
      where: {
        slug: slug,
      },
      select: { id: true },
    });

    if (tenant && tenant.id) {
      req.tenantId = tenant.id;
    }
  } catch (err) {
    // Do not fail the request on tenant resolve errors; just log and continue
    console.warn('Tenant resolver error:', err && err.message ? err.message : err);
  }
  return next();
}

