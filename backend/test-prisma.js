const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  .then((tables) => {
    console.log('TABLES:', tables);
    process.exit(0);
  })
  .catch(e => {
    console.error('STANDALONE CONNECT FAIL', e);
    process.exit(1);
  });
