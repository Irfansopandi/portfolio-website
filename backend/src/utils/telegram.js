let axios;
try {
  axios = require('axios');
} catch {
  axios = null;
}

/**
 * Escapes special HTML characters for Telegram HTML parse_mode
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sends Telegram notification when a new contact message is received.
 * @param {Object} messageData - { name, email, message }
 */
const sendTelegramNotification = async ({ name, email, message }) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.warn('Telegram Notification skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing in .env');
    return;
  }

  const sourceUrl = process.env.FRONTEND_URL || 'Website Portfolio';

  const text = `<b>🔔 Pesan Baru Portfolio</b>\n\n` +
    `<b>👤 Nama:</b>\n${escapeHtml(name)}\n\n` +
    `<b>📧 Email:</b>\n${escapeHtml(email)}\n\n` +
    `<b>💬 Pesan:</b>\n${escapeHtml(message)}\n\n` +
    `<b>🌐 Source:</b>\n${escapeHtml(sourceUrl)}`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    if (axios) {
      await axios.post(url, {
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      });
    } else if (typeof fetch !== 'undefined') {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });
    } else {
      const https = require('https');
      const payload = JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
      });
      const req = https.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      });
      req.on('error', (err) => console.error('Telegram HTTPS error:', err.message));
      req.write(payload);
      req.end();
    }
  } catch (error) {
    console.error('Telegram notification failed:', error?.response?.data || error.message);
  }
};

module.exports = { sendTelegramNotification };
