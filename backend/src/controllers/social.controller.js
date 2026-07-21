const prisma = require('../lib/prisma');

const getAllSocial = async (req, res) => {
  const social = await prisma.socialMedia.findMany({
    orderBy: { platform: 'asc' },
  });
  res.json(social);
};

const upsertSocial = async (req, res) => {
  const { platform, url, icon } = req.body;

  if (!platform || !url) {
    return res.status(400).json({ error: 'Platform dan URL wajib diisi.' });
  }

  const social = await prisma.socialMedia.upsert({
    where: { platform },
    update: { url, icon },
    create: { platform, url, icon },
  });

  res.json({ message: 'Media sosial berhasil diperbarui.', social });
};

const deleteSocial = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.socialMedia.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Media sosial tidak ditemukan.' });
  }

  await prisma.socialMedia.delete({ where: { id } });
  res.json({ message: 'Media sosial berhasil dihapus.' });
};

module.exports = { getAllSocial, upsertSocial, deleteSocial };
