const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const profile = await prisma.profile.findFirst();
  console.log('Profile stored in DB:', JSON.stringify(profile, null, 2));
  await prisma.$disconnect();
}

run().catch(console.error);
