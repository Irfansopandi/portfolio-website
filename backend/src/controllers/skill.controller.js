const prisma = require('../lib/prisma');

const getAllSkills = async (req, res) => {
  const { category } = req.query;
  const where = category ? { category } : {};
  
  const skills = await prisma.skill.findMany({
    where,
    orderBy: [{ category: 'asc' }, { order: 'asc' }],
  });

  // Group by category
  const grouped = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  res.json({ skills, grouped });
};

const createSkill = async (req, res) => {
  const { name, category, percentage, icon, order } = req.body;

  if (!name || !category) {
    return res.status(400).json({ error: 'Nama dan kategori wajib diisi.' });
  }

  const skill = await prisma.skill.create({
    data: {
      name,
      category,
      percentage: percentage ? parseInt(percentage) : 80,
      icon,
      order: order ? parseInt(order) : 0,
    },
  });

  res.status(201).json({ message: 'Keahlian berhasil ditambahkan.', skill });
};

const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, percentage, icon, order } = req.body;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Keahlian tidak ditemukan.' });
  }

  const skill = await prisma.skill.update({
    where: { id },
    data: {
      name: name || existing.name,
      category: category || existing.category,
      percentage: percentage !== undefined ? parseInt(percentage) : existing.percentage,
      icon: icon !== undefined ? icon : existing.icon,
      order: order !== undefined ? parseInt(order) : existing.order,
    },
  });

  res.json({ message: 'Keahlian berhasil diperbarui.', skill });
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.skill.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Keahlian tidak ditemukan.' });
  }

  await prisma.skill.delete({ where: { id } });
  res.json({ message: 'Keahlian berhasil dihapus.' });
};

module.exports = { getAllSkills, createSkill, updateSkill, deleteSkill };
