const prisma = require('../lib/prisma');
const { sendTelegramNotification } = require('../utils/telegram');

const getAllMessages = async (req, res) => {
  const { status } = req.query;
  const where = status ? { status } : {};
  
  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  const total = await prisma.message.count();
  const unread = await prisma.message.count({ where: { status: 'unread' } });

  res.json({ messages, total, unread });
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await prisma.message.count({
      where: { status: 'unread' }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: 'Gagal mendapatkan jumlah unread message.' });
  }
};

const createMessage = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nama, email, dan pesan wajib diisi.' });
  }

  // Simple email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Alamat email tidak valid.' });
  }

  const newMessage = await prisma.message.create({
    data: { name, email, message, status: 'unread' },
  });

  // Kirim Telegram Notification
  try {
    await sendTelegramNotification({ name, email, message });
  } catch (err) {
    console.error('Failed to send Telegram notification:', err.message);
  }

  res.status(201).json({ 
    message: 'Pesan berhasil dikirim. Saya akan segera menghubungi Anda!',
    data: newMessage 
  });
};

const updateMessageStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['read', 'unread'].includes(status)) {
    return res.status(400).json({ error: 'Status harus berupa "read" atau "unread".' });
  }

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
  }

  const updatedMessage = await prisma.message.update({
    where: { id },
    data: { status },
  });

  res.json({ message: 'Status pesan berhasil diperbarui.', data: updatedMessage });
};

const deleteMessage = async (req, res) => {
  const { id } = req.params;

  const existing = await prisma.message.findUnique({ where: { id } });
  if (!existing) {
    return res.status(404).json({ error: 'Pesan tidak ditemukan.' });
  }

  await prisma.message.delete({ where: { id } });
  res.json({ message: 'Pesan berhasil dihapus.' });
};

module.exports = { getAllMessages, getUnreadCount, createMessage, updateMessageStatus, deleteMessage };
