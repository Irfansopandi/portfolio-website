const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clean() {
  console.log('🧹 Cleaning duplicate skills...');
  const allSkills = await prisma.skill.findMany({
    orderBy: { updatedAt: 'desc' },
  });

  const seen = new Set();
  const idsToDelete = [];

  for (const s of allSkills) {
    const key = `${s.name.trim().toLowerCase()}::${s.category.trim().toLowerCase()}`;
    if (seen.has(key)) {
      idsToDelete.push(s.id);
    } else {
      seen.add(key);
    }
  }

  console.log(`Found ${idsToDelete.length} duplicate skills out of ${allSkills.length} total.`);

  if (idsToDelete.length > 0) {
    await prisma.skill.deleteMany({
      where: { id: { in: idsToDelete } },
    });
    console.log(`✅ Successfully deleted ${idsToDelete.length} duplicate skills.`);
  }

  const remaining = await prisma.skill.findMany({
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  console.log(`✨ Total clean skills remaining: ${remaining.length}`);
  console.log(remaining.map(s => `[${s.category}] ${s.name} (${s.percentage}%)`));

  // Also clean education duplicates if any
  const allEdu = await prisma.education.findMany({ orderBy: { createdAt: 'desc' } });
  const seenEdu = new Set();
  const eduToDelete = [];
  for (const e of allEdu) {
    const key = `${e.institution.trim().toLowerCase()}::${e.degree.trim().toLowerCase()}`;
    if (seenEdu.has(key)) {
      eduToDelete.push(e.id);
    } else {
      seenEdu.add(key);
    }
  }

  if (eduToDelete.length > 0) {
    await prisma.education.deleteMany({ where: { id: { in: eduToDelete } } });
    console.log(`✅ Deleted ${eduToDelete.length} duplicate education entries.`);
  } else {
    console.log('✅ Education entries are clean.');
  }

  await prisma.$disconnect();
}


clean().catch(err => {
  console.error('Error cleaning skills:', err);
  process.exit(1);
});
