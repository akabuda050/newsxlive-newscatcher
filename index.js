const config = require('./config');

const { sendMessage } = require('./services/mailgun');
const { fetchNews } = require('./services/newscatcher');
const { createPosts } = require('./services/ghost');

const init = async () => await createPosts(await fetchNews());

(async () => {
  try {
    await init();
    console.log('Success');
  } catch (e) {
    console.log('Fail');
    console.log('----------------');
    console.log(e);
    console.log('----------------');
    if (e.response && e.response.data && e.response.data.errors) {
      e.response.data.errors.forEach((error) => {
        console.log(error);
      });
    }
    console.log('----------------');
    if (config.services.mail.shouldSendEmails) {
      try {
        sendMessage({
          to: config.global.adminEmail,
          subject: `News x Live - Posts error!`,
          text: `<p>${JSON.stringify(e)}</p>`,
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
})();
