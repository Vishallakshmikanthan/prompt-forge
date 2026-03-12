import { PrismaClient } from '../generated/client';
// PrismaClient is auto-generated based on the schema at database/prisma/schema.prisma

// Singleton pattern to avoid multiple PrismaClient instances in development
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

// Test database connection
prisma.$connect()
    .then(() => {
        console.log('✅ Database connection status: Connected');
    })
    .catch((error) => {
        console.error('❌ Database connection status: Failed', error);
    });

export default prisma;
