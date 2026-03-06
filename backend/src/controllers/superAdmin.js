/**
 * Super Admin Controller
 * Create/disable admins, freeze interviews, stats by center/department/admin
 */

import prisma from '../config/database.js';
import bcrypt from 'bcryptjs';
import { createNotification } from './notifications.js';
import logger from '../config/logger.js';

/**
 * List all admin users (Super Admin only)
 */
export async function listAdmins(req, res) {
  try {
    const where = { role: 'ADMIN' };

    // Landlord sees all, College Super Admin sees only their own
    if (req.user.role !== 'SUPER_ADMIN') {
      where.tenantId = req.tenantId;
    }

    const admins = await prisma.user.findMany({
      where,
      include: {
        admin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const list = admins.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      status: u.status,
      lastLoginAt: u.lastLoginAt,
      createdAt: u.createdAt,
      adminId: u.admin?.id,
    }));

    res.json({ admins: list });
  } catch (error) {
    logger.error('List admins error:', error);
    res.status(500).json({ error: 'Failed to list admins' });
  }
}

/**
 * Create a new admin user (Super Admin only)
 */
export async function createAdmin(req, res) {
  try {
    const { email, password, displayName } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ error: 'Email is required' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const emailTrim = email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: emailTrim } });
    if (existing) {
      return res.status(400).json({ error: 'A user with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const name = (displayName && typeof displayName === 'string' ? displayName.trim() : null) || emailTrim;

    const { user, admin } = await prisma.$transaction(async (tx) => {
      const u = await tx.user.create({
        data: {
          email: emailTrim,
          passwordHash,
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: true,
          emailVerifiedAt: new Date(),
          displayName: name,
          tenantId: req.user.role === 'SUPER_ADMIN' ? (req.body.tenantId || null) : req.tenantId,
        },
      });
      const a = await tx.admin.create({
        data: { userId: u.id, name },
      });
      return { user: u, admin: a };
    });

    logger.info(`Super Admin created admin: ${user.email}`);

    res.status(201).json({
      admin: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        status: user.status,
        adminId: admin.id,
      },
    });
  } catch (error) {
    logger.error('Create admin error:', error);
    res.status(500).json({ error: 'Failed to create admin' });
  }
}

/**
 * Disable an admin (set status BLOCKED) - Super Admin only
 */
export async function disableAdmin(req, res) {
  try {
    const { userId } = req.params;
    const superAdminId = req.userId;

    const target = await prisma.user.findUnique({
      where: { id: userId },
      include: { admin: true },
    });

    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (target.role !== 'ADMIN') {
      return res.status(400).json({ error: 'Only admin users can be disabled' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'BLOCKED' },
    });

    try {
      await createNotification({
        userId: target.id,
        title: 'Admin account disabled',
        body: 'Your admin account has been disabled by a Super Admin.',
        data: { type: 'admin_disabled', disabledBy: superAdminId },
      });
    } catch (e) {
      logger.warn('Failed to notify disabled admin:', e);
    }

    logger.info(`Super Admin disabled admin: ${target.email}`);

    res.json({ message: 'Admin disabled successfully' });
  } catch (error) {
    logger.error('Disable admin error:', error);
    res.status(500).json({ error: 'Failed to disable admin' });
  }
}

/**
 * Enable an admin (set status ACTIVE) - Super Admin only
 */
export async function enableAdmin(req, res) {
  try {
    const { userId } = req.params;

    const target = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!target) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (target.role !== 'ADMIN') {
      return res.status(400).json({ error: 'Only admin users can be enabled' });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { status: 'ACTIVE' },
    });

    logger.info(`Super Admin enabled admin: ${target.email}`);

    res.json({ message: 'Admin enabled successfully' });
  } catch (error) {
    logger.error('Enable admin error:', error);
    res.status(500).json({ error: 'Failed to enable admin' });
  }
}

/**
 * Get Platform-wide stats (Landlord only)
 */
export async function getPlatformStats(req, res) {
  try {
    const [
      totalTenants,
      totalStudents,
      totalAdmins,
      totalJobs,
      totalApplications,
      activeCollegesList
    ] = await Promise.all([
      prisma.tenant.count(),
      prisma.student.count(),
      prisma.user.count({ where: { role: { in: ['TENANT_SUPER_ADMIN', 'ADMIN'] } } }),
      prisma.job.count(),
      prisma.application.count(),
      prisma.tenant.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { students: true, jobs: true }
          },
          owner: {
            select: { email: true }
          }
        }
      })
    ]);

    res.json({
      summary: {
        totalColleges: totalTenants,
        totalStudents,
        totalAdmins,
        totalJobs,
        totalApplications,
        growth: '+12%' // Placeholder for now
      },
      topColleges: activeCollegesList.map(t => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        owner: t.owner?.email,
        studentsCount: t._count.students,
        jobsCount: t._count.jobs,
        createdAt: t.createdAt
      }))
    });
  } catch (error) {
    logger.error('Platform stats error:', error);
    res.status(500).json({ error: 'Failed to fetch global stats' });
  }
}

/**
 * High-performance Stats Summary (Phase 1 Optimization)
 * Uses database aggregations instead of fetching full records.
 */
export async function getStatsSummary(req, res) {
  try {
    const [
      totalStudents,
      totalJobs,
      totalApplications,
      placedCount,
      byCenter,
      bySchool,
      byBatch,
      recruiterCount,
      queryCount,
      admins
    ] = await Promise.all([
      prisma.student.count({ where: { tenantId: req.tenantId } }),
      prisma.job.count({ where: { tenantId: req.tenantId } }),
      // Applications belong to jobs; filter applications by job.tenantId
      prisma.application.count({ where: { job: { tenantId: req.tenantId } } }),
      prisma.application.count({
        where: {
          job: { tenantId: req.tenantId },
          OR: [
            { status: 'SELECTED' },
            { status: 'OFFERED' },
            { status: 'ACCEPTED' },
            { interviewStatus: 'SELECTED' }
          ]
        }
      }),
      prisma.student.groupBy({
        where: { tenantId: req.tenantId },
        by: ['center'],
        _count: { _all: true }
      }),
      prisma.student.groupBy({
        where: { tenantId: req.tenantId },
        by: ['school'],
        _count: { _all: true }
      }),
      prisma.student.groupBy({
        where: { tenantId: req.tenantId },
        by: ['batch'],
        _count: { _all: true }
      }),
      prisma.user.count({
        where: { role: 'RECRUITER', status: { in: ['ACTIVE', 'PENDING'] }, tenantId: req.tenantId }
      }),
      // StudentQuery is linked to User (student). Filter by user.tenantId
      prisma.studentQuery.count({
        where: { status: { in: ['pending', 'open', 'unresolved'] }, user: { tenantId: req.tenantId } }
      }),
      prisma.user.findMany({
        where: {
          role: { in: ['TENANT_SUPER_ADMIN', 'ADMIN'] },
          tenantId: req.tenantId
        },
        select: {
          id: true,
          email: true,
          displayName: true,
          role: true,
          status: true,
          lastLoginAt: true,
          createdAt: true,
        }
      })
    ]);

    res.json({
      summary: {
        totalStudents,
        totalJobs,
        totalApplications,
        placedStudents: placedCount,
        placementRate: totalStudents > 0 ? (placedCount / totalStudents) * 100 : 0,
        activeRecruiters: recruiterCount,
        pendingQueries: queryCount
      },
      admins: admins.map((a) => ({
        id: a.id,
        email: a.email,
        displayName: a.displayName,
        role: a.role,
        status: a.status,
        lastLoginAt: a.lastLoginAt,
        createdAt: a.createdAt,
      })),
      byCenter: byCenter.map(c => ({
        center: c.center || 'Unknown',
        total: c._count._all
      })),
      bySchool: bySchool.map(s => ({
        school: s.school || 'Unknown',
        total: s._count._all
      })),
      byBatch: byBatch.map(b => ({
        batch: b.batch || 'Unknown',
        total: b._count._all
      }))
    });
  } catch (error) {
    logger.error('Get stats summary error:', error);
    res.status(500).json({ error: 'Failed to fetch stats summary' });
  }
}
