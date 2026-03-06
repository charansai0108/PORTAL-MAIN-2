
import prisma from './src/config/database.js';
import { v4 as uuidv4 } from 'uuid';

async function migrateToDefaultTenant() {
    try {
        console.log('🚀 Starting migration to default tenant...');

        // 1. Create a default tenant
        const defaultTenant = await prisma.tenant.upsert({
            where: { slug: 'default' },
            update: {},
            create: {
                id: uuidv4(),
                name: 'Default Organization',
                slug: 'default',
                settings: '{}',
            },
        });

        console.log(`✅ Default tenant created/found: ${defaultTenant.id}`);

        // 2. Update all users
        const usersUpdate = await prisma.user.updateMany({
            where: { tenantId: null },
            data: { tenantId: defaultTenant.id },
        });
        console.log(`✅ Updated ${usersUpdate.count} users.`);

        // 3. Update all students
        const studentsUpdate = await prisma.student.updateMany({
            where: { tenantId: null },
            data: { tenantId: defaultTenant.id },
        });
        console.log(`✅ Updated ${studentsUpdate.count} students.`);

        // 4. Update all jobs
        const jobsUpdate = await prisma.job.updateMany({
            where: { tenantId: null },
            data: { tenantId: defaultTenant.id },
        });
        console.log(`✅ Updated ${jobsUpdate.count} jobs.`);

        // 5. Update all announcements
        const announcementsUpdate = await prisma.announcement.updateMany({
            where: { tenantId: null },
            data: { tenantId: defaultTenant.id },
        });
        console.log(`✅ Updated ${announcementsUpdate.count} announcements.`);

        // 6. Update all audit logs
        const auditLogsUpdate = await prisma.auditLog.updateMany({
            where: { tenantId: null },
            data: { tenantId: defaultTenant.id },
        });
        console.log(`✅ Updated ${auditLogsUpdate.count} audit logs.`);

        console.log('🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateToDefaultTenant();
