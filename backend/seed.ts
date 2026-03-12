import { PrismaClient } from './src/generated/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.upsert({
        where: { id: 'dummy-user-id' },
        update: {},
        create: {
            id: 'dummy-user-id',
            username: 'testuser',
            email: 'test@example.com'
        }
    });
    console.log('User dummy-user-id ensure');

    await prisma.prompt.create({
        data: {
            title: 'Test Prompt',
            description: 'This is a test prompt for analytics',
            promptContent: 'Tell me a joke about AI',
            category: 'LIFESTYLE',
            aiModel: 'GPT-4',
            authorId: 'dummy-user-id',
            moderationStatus: 'approved',
            score: 0
        }
    });
    console.log('Test Prompt created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
