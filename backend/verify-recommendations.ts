import * as recommendationService from './src/services/recommendationService';
import * as discoveryService from './src/services/discoveryService';
import prisma from './src/config/prisma';

async function verifyRecommendations() {
    console.log('--- Starting Verification ---');

    try {
        // 1. Get a test prompt
        const prompts = await prisma.prompt.findMany({ take: 1 });
        const testPrompt = prompts[0];

        if (!testPrompt) {
            console.log('No prompts found in DB. Please seed the database first.');
            return;
        }

        console.log(`Testing Similar Prompts for: "${testPrompt.title}" (${testPrompt.id})`);
        const similar = await recommendationService.getSimilarPrompts(testPrompt.id, 3);
        console.log('Similar Prompts found:', similar.length);
        similar.forEach((p: any) => console.log(` - ${p.title} (Similarity: ${p.similarity?.toFixed(4)})`));

        console.log('\nTesting Trending Prompts (via Discovery)');
        const trending = await discoveryService.getTrendingPrompts(3);
        console.log('Trending Prompts found:', trending.length);
        trending.forEach((p: any) => console.log(` - ${p.title} (Score: ${p.trendingScore})`));

        // 2. Get a test user
        const users = await prisma.user.findMany({ take: 1 });
        const testUser = users[0];

        if (testUser) {
            console.log(`\nTesting Personalized Prompts for user: ${testUser.username} (${testUser.id})`);
            const personalized = await recommendationService.getPersonalizedPrompts(testUser.id, 3);
            console.log('Personalized Prompts found:', personalized.length);
            personalized.forEach((p: any) => console.log(` - ${p.title}`));
        }

        console.log('\n--- Verification Complete ---');
    } catch (error) {
        console.error('Verification Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyRecommendations();
