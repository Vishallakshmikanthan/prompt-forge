import { PrismaClient } from '../backend/src/generated/client';
const prisma = new PrismaClient();

async function main() {
    const prompt = await prisma.prompt.findFirst();
    console.log(JSON.stringify(prompt, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
