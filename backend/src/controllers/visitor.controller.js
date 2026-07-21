const prisma = require('../lib/prisma');

const trackVisitor = async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const userAgent = req.headers['user-agent'];
  const { page } = req.body;

  await prisma.visitor.create({
    data: { ip, userAgent, page },
  });

  res.json({ message: 'Visitor tracked.' });
};

const getStats = async (req, res) => {
  const [totalProjects, totalCertificates, totalMessages, totalVisitors] = await Promise.all([
    prisma.project.count(),
    prisma.certificate.count(),
    prisma.message.count(),
    prisma.visitor.count(),
  ]);

  const unreadMessages = await prisma.message.count({ where: { status: 'unread' } });

  res.json({
    totalProjects,
    totalCertificates,
    totalMessages,
    totalVisitors,
    unreadMessages,
  });
};

module.exports = { trackVisitor, getStats };
