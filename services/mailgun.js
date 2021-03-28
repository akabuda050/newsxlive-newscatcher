const config = require('../config');
const apiKey = config.services.mail.mailgunApiKey;
const domain = config.services.mail.mailgunDomain;
const host = config.services.mail.mailgunHost;

const mailgun = require('mailgun-js')({ apiKey: apiKey, domain, host });
const MailComposer = require('nodemailer/lib/mail-composer');

const sendMessage = function ({ to, subject, text }) {
  let payload = { from: config.services.mail.mailgunFromString, to, subject, text: text, html: text };
  const mail = new MailComposer(payload);

  mail.compile().build((err, message) => {
    const dataToSend = {
      to: to,
      message: message.toString('ascii'),
    };

    mailgun.messages().sendMime(dataToSend, function (error, body) {
      console.log(`sendMessage!!!`);
      console.log({ error, body });
      if (error) {
        throw new Error(JSON.stringify(error));
      }
    });
  });
};

module.exports = { sendMessage };
