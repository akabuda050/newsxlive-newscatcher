const config = require('../config');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { removeSearchParams } = require('../helpers');
const { renderMobileDoc, prepareLightMobileDoc } = require('../helpers/mobileDoc');
const { sendMessage } = require('./mailgun');

const authHeaders = async () => {
  // Admin API key goes here
  const key = config.services.ghost.ghostAdminApiKey;
  // Split the key into ID and SECRET
  const [id, secret] = key.split(':');

  // Create the token (including decoding secret)
  const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: '5m',
    audience: `/v3/admin/`,
  });
  return { Authorization: `Ghost ${token}` };
};

const createPosts = async (articles) => {
  const headers = await authHeaders();
  const url = `${config.services.ghost.ghostApiUrl}/ghost/api/v3/admin/posts/`;
  const posts = await preparePosts(articles);

  // Create
  return Promise.all(
    posts.map((post) => {
      const payload = { posts: [post] };
      return axios.post(url, payload, { headers }).then((response) => {
        const post = response.data.posts.find((p) => p.id !== undefined);
        if (post) {
          console.log(`${post.title} has been saved!`);
          if (config.services.mail.shouldSendEmails === 'true') {
            sendPostCreatedNotification(post);
          }
        }
        return post;
      });
    }),
  );
};

const preparePosts = async (articles) => {
  let authors = [await randomAuthor()];

  return articles.map((a) => {
    let media = removeSearchParams(a.media);
    // Post
    return {
      title: a.title,
      mobiledoc: prepareLightMobileDoc(a),
      //'created_at': new Date(a.published_date),
      //'published_at': new Date(a.published_date),
      feature_image: media.href,
      status: 'draft',
      tags: [{ name: a.topic }],
      authors: authors,
    };
  });
};

const sendPostCreatedNotification = (post) => {
  const recipients = post.authors.map((a) => a.email).join(',');
  try {
    sendMessage({
      to: recipients,
      subject: `News x Live - Post created!`,
      text: `${renderMobileDoc(JSON.parse(post.mobiledoc))} <p><a style="width: 100px;height: 25px;border: 1px solid black;border-radius: 4px;background: rebeccapurple;position: absolute; padding: 10px;color: white;font-size: 20px;" href="https://www.newsxlive.com/ghost/#/editor/post/${post.id}/">Publish?</a> </p>`,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

const randomAuthor = async () => {
  const authors = await prepareAuthors();
  return authors[Math.floor(Math.random() * authors.length)];
};

const prepareAuthors = async () => {
  return config.services.ghost.ghostAuthors.split(';');
};

module.exports = {
  createPosts,
};
