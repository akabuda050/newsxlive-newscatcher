require('../bootstrap');

module.exports = {
  global: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
  },
  services: {
    mail: {
      mailgunHost: process.env.MAILGUN_HOST || null,
      mailgunDomain: process.env.MAILGUN_DOMAIN || null,
      mailgunApiKey: process.env.MAILGUN_API_KEY || null,
      mailgunFromString: process.env.MAILGUN_FROM_STRING || '',
      shouldSendEmails: process.env.SEND_EMAILS || false,
    },
    newscatcher: {
      rapidApiUrl: process.env.X_RAPID_API_URL || '',
      rapidApiKEy: process.env.X_RAPID_API_KEY || '',
      rapidApiHost: process.env.X_RAPID_API_HOST || '',
      fetchTodaysOnly: process.env.TODAY_ONLY || false,
    },
    ghost: {
      ghostApiUrl: process.env.GHOST_API_URL || 'http://localhost:2368',
      ghostAdminApiKey: process.env.GHOST_ADMIN_API_KEY || '',
      ghostAuthors: process.env.GHOST_AUTHORS || 'admin@example.com',
    },
  },
};
