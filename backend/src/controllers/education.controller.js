const prisma = require('../lib/prisma');

const getAllEducation = async (req, res) => {
  const education = await prisma.education.findMany({
    orderBy: { order: 'desc' },
  });
  res.json(education);
};

const createEducation = async (req, res) => {
  const { institution, institutionEn, degree, degreeEn, startDate, startDateEn, endDate, endDateEn, description, descriptionEn, order } = req.body;

  if (!institution || !degree || !startDate) {
    return res.status(400).json({ error: 'Institusi, gelar, dan tanggal mulai wajib diisi.' });
  }

  const logoUrl = req.file?.path || null;

  const education = await prisma.education.create({
    data: {
      institution,
      institutionEn: institutionEn || null,
      degree,
      degreeEn: degreeEn || null,
      startDate,
      startDateEn: startDateEn || null,
      endDate,
      endDateEn: endDateEn || null,
      description,
      descriptionEn: descriptionEn || null,
      logo: logoUrl,
      order: order ? parseInt(order) : 0,
    },
  });

  res.status(201).json({ message: 'Pendidikan berhasil ditambahkan.', education });
};

const updateEducation = async (req, res) => {
  const { id } = req.params;
  const { institution, institutionEn, degree, degreeEn, startDate, startDateEn, endDate, endDateEn, description, descriptionEn, order } = req.body;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Data pendidikan tidak ditemukan.' });
  }

  const logoUrl = req.file?.path || existing.logo;

  const education = await prisma.education.update({
    where: { id },
    data: {
      institution: institution || existing.institution,
      institutionEn: institutionEn !== undefined ? institutionEn : existing.institutionEn,
      degree: degree || existing.degree,
      degreeEn: degreeEn !== undefined ? degreeEn : existing.degreeEn,
      startDate: startDate || existing.startDate,
      startDateEn: startDateEn !== undefined ? startDateEn : existing.startDateEn,
      endDate: endDate !== undefined ? endDate : existing.endDate,
      endDateEn: endDateEn !== undefined ? endDateEn : existing.endDateEn,
      description: description !== undefined ? description : existing.description,
      descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
      logo: logoUrl,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
  });

  res.json({ message: 'Data pendidikan berhasil diperbarui.', education });
};

const deleteEducation = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.education.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Data pendidikan tidak ditemukan.' });
  }

  await prisma.education.delete({ where: { id } });
  res.json({ message: 'Data pendidikan berhasil dihapus.' });
};

module.exports = { getAllEducation, createEducation, updateEducation, deleteEducation };
