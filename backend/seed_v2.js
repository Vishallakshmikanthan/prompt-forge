const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Seeding data...');

    // 1. Create a few users
    const users = [
        { id: 'user_1', username: 'alex_dev', email: 'alex@promptforge.com', displayName: 'Alex Chen', avatarUrl: 'https://i.pravatar.cc/150?u=user_1' },
        { id: 'user_2', username: 'sarah_ai', email: 'sarah@promptforge.com', displayName: 'Sarah Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=user_2' },
        { id: 'user_3', username: 'mike_code', email: 'mike@promptforge.com', displayName: 'Mike Ross', avatarUrl: 'https://i.pravatar.cc/150?u=user_3' },
    ];

    for (const u of users) {
        await prisma.user.upsert({
            where: { id: u.id },
            update: u,
            create: u
        });
    }

    // 2. Sample Prompts
    const promptsData = [
        {
            title: 'Robust Error Handler',
            description: 'Advanced error handling wrapper for Express.js with cleanup logic.',
            promptContent: 'Write a robust error handler for Express that logs to Sentry and masks sensitive data.',
            category: 'CODE_GENERATION',
            aiModel: 'GPT-4',
            tags: ['typescript', 'express', 'sentry'],
            authorId: 'user_1',
            votes: 120, forks: 45, views: 1200
        },
        {
            title: 'Unit Test Generator',
            description: 'Converts production code to comprehensive Jest unit tests.',
            promptContent: 'Generate Jest unit tests for the following TypeScript component: [CODE]',
            category: 'CODE_GENERATION',
            aiModel: 'Claude 3.5 Sonnet',
            tags: ['jest', 'testing', 'react'],
            authorId: 'user_2',
            votes: 85, forks: 12, views: 900
        },
        {
            title: 'SQL Query Optimizer',
            description: 'Analyze slow queries and suggest indexes or rewriting.',
            promptContent: 'Optimize this PostgreSQL query for better performance: [QUERY]',
            category: 'DATA_ANALYSIS',
            aiModel: 'GPT-4',
            tags: ['sql', 'postgres', 'optimization'],
            authorId: 'user_3',
            votes: 210, forks: 80, views: 3000
        },
        {
            title: 'Creative Story Architect',
            description: 'Generate deep lore and character arcs for RPG campaigns.',
            promptContent: 'Build a detailed world map and 3 main factions for a grimdark fantasy setting.',
            category: 'CREATIVE_WRITING',
            aiModel: 'GPT-4',
            tags: ['fantasy', 'rpg', 'writing'],
            authorId: 'user_1',
            votes: 55, forks: 5, views: 400
        },
        {
            title: 'SEO Meta Description Pro',
            description: 'Generate high-CTR meta descriptions based on page content.',
            promptContent: 'Create 5 variations of a meta description for this landing page to maximize focus on keyword [X].',
            category: 'MARKETING',
            aiModel: 'Claude 3 Opus',
            tags: ['seo', 'copywriting', 'marketing'],
            authorId: 'user_2',
            votes: 15, forks: 2, views: 150
        }
    ];

    for (const p of promptsData) {
        const createdPrompt = await prisma.prompt.create({
            data: {
                title: p.title,
                description: p.description,
                promptContent: p.promptContent,
                category: p.category,
                aiModel: p.aiModel,
                tags: p.tags,
                authorId: p.authorId,
                moderationStatus: 'approved',
                score: p.votes
            }
        });

        // Create analytics for ranking
        await prisma.promptAnalytics.create({
            data: {
                promptId: createdPrompt.id,
                views: p.views,
                votes: p.votes,
                forks: p.forks,
                bookmarks: Math.floor(p.views / 10)
            }
        });
    }

    console.log('Seeding complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
