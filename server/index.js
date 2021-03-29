const config = require('../config');
const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const { verifyToken } = require('../services/tokenManager');
const { deletePost, setPostStatus } = require('../services/ghost');

const initServer = () => {
  const app = express();

  app.get('/posts/:postId/:token/:status', async (req, res) => {
    const acceptStatuses = ['published', 'draft', 'delete'];
    const postId = req.params.postId;
    const status = req.params.status;
    const token = decodeURIComponent(req.params.token);
    const secret = `${config.services.newscatcher.postActionsSecret}`;

    if (!verifyToken(token, secret)) return res.status(401).send('Token is not valid');
    if (!acceptStatuses.includes(status)) return res.status(400).send(`${status} is not valid status!`);

    let result;
    let resStatus = 200;

    try {
      if (status == 'delete') {
        await deletePost(postId);
        result = `Post ${postId} has been deleted.`;
      } else {
        await setPostStatus(postId, 'published');
        result = `Post status has been changed to ${status}. Post id: ${postId}.`;
      }
    } catch (e) {
      logError(e);
      result = e.message;
      resStatus = 500;
    }
    res.status(resStatus).send(result);
  });

  if (config.global.appIsServerSecure === 'true') {
    const privateKey = fs.readFileSync(config.global.appPrivateKey, 'utf8');
    const certificate = fs.readFileSync(config.global.appCertificate, 'utf8');
    const credentials = { key: privateKey, cert: certificate };
    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(config.global.appServerSecurePort, () => {
      console.log(`Server is listening at ${config.global.appServerUrl}:${config.global.appServerSecurePort}`);
    });
  } else {
    const httpServer = http.createServer(app);
    httpServer.listen(config.global.appServerPort, () => {
      console.log(`Server is listening at ${config.global.appServerUrl}:${config.global.appServerPort}`);
    });
  }
};

const logError = (e) => {
  console.log(e);
  if (e.response && e.response.data && e.response.data.errors) {
    e.response.data.errors.forEach((error) => {
      console.log(error);
    });
  }
};

try {
  initServer();
} catch (e) {
  console.log(e);
}
