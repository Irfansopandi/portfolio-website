const prisma = require('../lib/prisma');

const getAllCertificates = async (req, res) => {
  const certificates = await prisma.certificate.findMany({
    orderBy: { date: 'desc' },
  });
  res.json(certificates);
};

const createCertificate = async (req, res) => {
  const { title, titleEn, issuer, date, credentialUrl } = req.body;

  if (!title || !issuer || !date) {
    return res.status(400).json({ error: 'Judul, penerbit, dan tanggal wajib diisi.' });
  }

  const imageUrl = req.file?.path || null;

  const certificate = await prisma.certificate.create({
    data: {
      title,
      titleEn: titleEn || null,
      issuer,
      image: imageUrl,
      date,
      credentialUrl,
    },
  });

  res.status(201).json({ message: 'Sertifikat berhasil ditambahkan.', certificate });
};

const updateCertificate = async (req, res) => {
  const { id } = req.params;
  const { title, titleEn, issuer, date, credentialUrl } = req.body;

  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
  }

  const imageUrl = req.file?.path || existing.image;

  const certificate = await prisma.certificate.update({
    where: { id },
    data: {
      title: title || existing.title,
      titleEn: titleEn !== undefined ? titleEn : existing.titleEn,
      issuer: issuer || existing.issuer,
      image: imageUrl,
      date: date || existing.date,
      credentialUrl: credentialUrl !== undefined ? credentialUrl : existing.credentialUrl,
    },
  });

  res.json({ message: 'Sertifikat berhasil diperbarui.', certificate });
};

const deleteCertificate = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Sertifikat tidak ditemukan.' });
  }

  await prisma.certificate.delete({ where: { id } });
  res.json({ message: 'Sertifikat berhasil dihapus.' });
};

module.exports = { getAllCertificates, createCertificate, updateCertificate, deleteCertificate };
