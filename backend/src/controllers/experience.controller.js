const prisma = require('../lib/prisma');

const getAllExperiences = async (req, res) => {
  const { type } = req.query;
  const where = {};
  if (type && type !== 'All') {
    where.type = type;
  }

  const experiences = await prisma.experience.findMany({
    where,
    include: {
      photos: true,
    },
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  });

  res.json(experiences);
};

const createExperience = async (req, res) => {
  const { type, organization, institution, role, roleEn, startDate, endDate, description, descriptionEn, order, photos } = req.body;

  if (!organization || !role || !startDate) {
    return res.status(400).json({ error: 'Nama organisasi/perusahaan, jabatan, dan tanggal mulai wajib diisi.' });
  }

  // Handle uploaded files and JSON photo list
  let photoData = [];
  if (photos) {
    try {
      const parsedPhotos = Array.isArray(photos) ? photos : JSON.parse(photos);
      parsedPhotos.forEach((p) => {
        if (typeof p === 'string') photoData.push({ url: p });
        else if (p && p.url) photoData.push({ url: p.url, caption: p.caption || null, captionEn: p.captionEn || null });
      });
    } catch (e) {
      console.error('Error parsing photos JSON in create:', e);
    }
  }
  if (req.files && req.files.length > 0) {
    req.files.forEach((file) => {
      photoData.push({ url: file.path });
    });
  }

  const experience = await prisma.experience.create({
    data: {
      type: type || 'work',
      organization,
      institution: institution || null,
      role,
      roleEn: roleEn || null,
      startDate,
      endDate: endDate || null,
      description: description || null,
      descriptionEn: descriptionEn || null,
      order: order ? parseInt(order) : 0,
      photos: {
        create: photoData,
      },
    },
    include: {
      photos: true,
    },
  });

  res.status(201).json({ message: 'Pengalaman berhasil ditambahkan.', experience });
};

const updateExperience = async (req, res) => {
  const { id } = req.params;
  const { type, organization, institution, role, roleEn, startDate, endDate, description, descriptionEn, order, photos } = req.body;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Data pengalaman tidak ditemukan.' });
  }

  // Check if photos need to be updated
  let updatePhotosConfig = undefined;
  if ((req.files && req.files.length > 0) || photos !== undefined) {
    await prisma.experiencePhoto.deleteMany({ where: { experienceId: id } });
    
    let photoData = [];
    if (photos) {
      try {
        const parsedPhotos = Array.isArray(photos) ? photos : JSON.parse(photos);
        parsedPhotos.forEach((p) => {
          if (typeof p === 'string') photoData.push({ url: p });
          else if (p && p.url) photoData.push({ url: p.url, caption: p.caption || null, captionEn: p.captionEn || null });
        });
      } catch (e) {
        console.error('Error parsing photos JSON in update:', e);
      }
    }
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        photoData.push({ url: file.path });
      });
    }

    updatePhotosConfig = {
      create: photoData,
    };
  }


  const experience = await prisma.experience.update({
    where: { id },
    data: {
      type: type !== undefined ? type : existing.type,
      organization: organization !== undefined ? organization : existing.organization,
      institution: institution !== undefined ? institution : existing.institution,
      role: role !== undefined ? role : existing.role,
      roleEn: roleEn !== undefined ? roleEn : existing.roleEn,
      startDate: startDate !== undefined ? startDate : existing.startDate,
      endDate: endDate !== undefined ? endDate : existing.endDate,
      description: description !== undefined ? description : existing.description,
      descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
      order: order !== undefined ? parseInt(order) : existing.order,
      ...(updatePhotosConfig && { photos: updatePhotosConfig }),
    },
    include: {
      photos: true,
    },
  });

  res.json({ message: 'Data pengalaman berhasil diperbarui.', experience });
};

const deleteExperience = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Data pengalaman tidak ditemukan.' });
  }

  await prisma.experience.delete({ where: { id } });
  res.json({ message: 'Data pengalaman berhasil dihapus.' });
};

module.exports = {
  getAllExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
};
