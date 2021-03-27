const config = require('./config');
const { sendMessage } = require('./services/mailgun');

sendMessage({
  to: config.global.adminEmail,
  subject: `News x Live - Post created!`,
  text: `<h5>1 has been created!</h5><p>123</p>`,
});
