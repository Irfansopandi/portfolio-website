const prisma = require('../lib/prisma');
const slugify = require('slug');

const getAllProjects = async (req, res) => {
  const { category, featured } = req.query;
  
  const where = {};
  if (category) where.category = category;
  if (featured === 'true') where.featured = true;

  const projects = await prisma.project.findMany({
    where,
    include: {
      technologies: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(projects);
};

const getProjectBySlug = async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { slug: req.params.slug },
    include: { technologies: true },
  });

  if (!project) {
    return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
  }

  res.json(project);
};

const createProject = async (req, res) => {
  const { title, titleEn, category, description, descriptionEn, features, featuresEn, challenge, challengeEn, solution, solutionEn, githubUrl, demoUrl, featured, technologies } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Judul, kategori, dan deskripsi wajib diisi.' });
  }

  const slug = slugify(title, { lower: true });
  const imageUrl = req.file?.path || null;

  const project = await prisma.project.create({
    data: {
      title,
      titleEn: titleEn || null,
      slug,
      image: imageUrl,
      category,
      description,
      descriptionEn: descriptionEn || null,
      features: features || null,
      featuresEn: featuresEn || null,
      challenge: challenge || null,
      challengeEn: challengeEn || null,
      solution: solution || null,
      solutionEn: solutionEn || null,
      githubUrl,
      demoUrl,
      featured: featured === 'true' || featured === true,
      technologies: {
        create: (Array.isArray(technologies) ? technologies : JSON.parse(technologies || '[]'))
          .map((tech) => ({ technology: tech })),
      },
    },
    include: { technologies: true },
  });

  res.status(201).json({ message: 'Proyek berhasil ditambahkan.', project });
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { title, titleEn, category, description, descriptionEn, features, featuresEn, challenge, challengeEn, solution, solutionEn, githubUrl, demoUrl, featured, technologies } = req.body;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
  }

  const imageUrl = req.file?.path || existing.image;
  const slug = title ? slugify(title, { lower: true }) : existing.slug;

  // Delete old technologies and recreate
  await prisma.projectTechnology.deleteMany({ where: { projectId: id } });

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: title || existing.title,
      titleEn: titleEn !== undefined ? titleEn : existing.titleEn,
      slug,
      image: imageUrl,
      category: category || existing.category,
      description: description || existing.description,
      descriptionEn: descriptionEn !== undefined ? descriptionEn : existing.descriptionEn,
      features: features !== undefined ? features : existing.features,
      featuresEn: featuresEn !== undefined ? featuresEn : existing.featuresEn,
      challenge: challenge !== undefined ? challenge : existing.challenge,
      challengeEn: challengeEn !== undefined ? challengeEn : existing.challengeEn,
      solution: solution !== undefined ? solution : existing.solution,
      solutionEn: solutionEn !== undefined ? solutionEn : existing.solutionEn,
      githubUrl: githubUrl !== undefined ? githubUrl : existing.githubUrl,
      demoUrl: demoUrl !== undefined ? demoUrl : existing.demoUrl,
      featured: featured !== undefined ? (featured === 'true' || featured === true) : existing.featured,
      technologies: {
        create: (Array.isArray(technologies) ? technologies : JSON.parse(technologies || '[]'))
          .map((tech) => ({ technology: tech })),
      },
    },
    include: { technologies: true },
  });

  res.json({ message: 'Proyek berhasil diperbarui.', project });
};


const deleteProject = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Proyek tidak ditemukan.' });
  }

  await prisma.project.delete({ where: { id } });
  res.json({ message: 'Proyek berhasil dihapus.' });
};

module.exports = { getAllProjects, getProjectBySlug, createProject, updateProject, deleteProject };
