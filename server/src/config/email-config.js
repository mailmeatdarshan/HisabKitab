const nodeMailer = require('nodemailer');
const { EMAIL, GMAIL_PASS } = require('./server-config');

let mailSender = null;

function getMailSender() {
  if (mailSender) return mailSender;

  if (!EMAIL || !GMAIL_PASS) {
    console.warn("⚠️  EMAIL_USER or EMAIL_PASS not set — email features will be unavailable");
    return null;
  }

  mailSender = nodeMailer.createTransport({
    service: 'Gmail',
    auth: {
      user: EMAIL,
      pass: GMAIL_PASS,
    },
  });

  return mailSender;
}

module.exports = { getMailSender };