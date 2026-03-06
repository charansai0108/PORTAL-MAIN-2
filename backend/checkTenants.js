
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    const users = await prisma.user.findMany({ select: { email: true, tenantId: true } });
    console.log('Users Tenant Check:', users);
    await prisma.$disconnect();
}
check();
