
const { PrismaClient } = require('./src/generated/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const promptCount = await prisma.prompt.count();
        console.log(`Database Stats: Users=${userCount}, Prompts=${promptCount}`);

        if (userCount > 0) {
            const users = await prisma.user.findMany({ take: 5 });
            console.log('Sample Users:', JSON.stringify(users, null, 2));
        }
    } catch (error) {
        console.error('Error checking DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
