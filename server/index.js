const config = require('../config');
const fs = require('fs');
const express = require('express');
const http = require('http');
const https = require('https');
const { verifyToken } = require('../services/tokenManager');
const { deletePost, setPostStatus } = require('../services/ghost');

const initServer = () => {
  const app = express();

  app.get('/posts/:postId/:token/draft', async (req, res) => {
    const postId = req.params.postId;
    const token = decodeURIComponent(req.params.token);

    if (!verifyToken(token, postId)) return res.send('Token is not valid');
    let result = 'Hey!';

    try {
      result = await setPostStatus(postId, 'draft');
    } catch (e) {
      result = e.message;
    }
    res.send(result);
  });

  app.get('/posts/:postId/:token/publish', async (req, res) => {
    const postId = req.params.postId;
    const token = decodeURIComponent(req.params.token);

    if (!verifyToken(token, postId)) return res.send('Token is not valid');
    let result = 'Hey!';

    try {
      result = await setPostStatus(postId, 'publish');
    } catch (e) {
      result = e.message;
    }
    res.send(result);
  });

  app.get('/posts/:postId/:token/delete', async (req, res) => {
    const postId = req.params.postId;
    const token = decodeURIComponent(req.params.token);

    if (!verifyToken(token, postId)) return res.send('Token is not valid');
    let result = 'Hey!';

    try {
      result = await deletePost(postId);
    } catch (e) {
      result = e.message;
    }
    res.send(result);
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

try {
  initServer();
} catch (e) {
  console.log(e);
}
