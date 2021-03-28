require('../bootstrap');

module.exports = {
  global: {
    adminEmail: process.env.ADMIN_EMAIL || 'admin@example.com',
    appServerUrl: process.env.APP_SERVER_URL || 'http://localhost',
    appServerPort: process.env.APP_SERVER_PORT || 8055,
    appServerSecurePort: process.env.APP_SERVER_SECURE_PORT || 8443,
    appIsServerSecure: process.env.APP_IS_SERVER_SECURE || false,
    appPrivateKey: process.env.APP_SERVER_PRIVATE_KEY || null,
    appCertificate: process.env.APP_SERVER_CERTIFICATE || null,
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
      postActionsSecret: process.env.POST_ACTIONS_SECRET || '',
    },
    ghost: {
      ghostApiUrl: process.env.GHOST_API_URL || 'http://localhost:2368',
      ghostAdminApiKey: process.env.GHOST_ADMIN_API_KEY || '',
      ghostAuthors: process.env.GHOST_AUTHORS || 'admin@example.com',
    },
  },
};
