const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi.' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: 'Email atau password salah.' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Email atau password salah.' });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  res.json({
    message: 'Login berhasil',
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
};

const me = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    return res.status(404).json({ error: 'User tidak ditemukan.' });
  }

  res.json(user);
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Password saat ini dan password baru wajib diisi.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'Password baru harus minimal 8 karakter.' });
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    return res.status(401).json({ error: 'Password saat ini salah.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  res.json({ message: 'Password berhasil diubah.' });
};

module.exports = { login, me, changePassword };
