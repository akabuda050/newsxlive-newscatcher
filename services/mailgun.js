const config = require('../config');
const apiKey = config.services.mail.mailgunApiKey;
const domain = config.services.mail.mailgunDomain;
const host = config.services.mail.mailgunHost;

const mailgun = require('mailgun-js')({ apiKey: apiKey, domain, host });

const sendMessage = function ({ to, subject, text }) {
  let payload = { from: config.services.mail.mailgunFromString, to, subject, text };
  mailgun.messages().send(payload, function (error, body) {
    console.log(`sendMessage!!!`);
    console.log({ error, body });
    if (error) {
      throw new Error(JSON.stringify(error));
    }
  });
};

module.exports = { sendMessage };
