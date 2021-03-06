const config = require('../config');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const { removeSearchParams } = require('../helpers');
const { renderMobileDoc, prepareLightMobileDoc } = require('../helpers/mobileDoc');
const { sendMessage } = require('./mailgun');
const { generateToken } = require('./tokenManager');

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
          console.log(`${post.title} has been saved and assigned to ${post.authors.map(a => a.email).join(',')}!`);
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
  return Promise.all(articles.map(async (a) => {
    let authors = [await randomAuthor()];
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
  }))
};

const actionButtonStyle = (background) => {
  return `width: 100px;height: 25px;border: 1px solid black;border-radius: 4px;background: ${background};position: absolute; padding: 10px;color: white;font-size: 20px;`;
};

const sendPostCreatedNotification = (post) => {
  const recipients = post.authors.map((a) => a.email).join(',');
  const token = encodeURIComponent(generateToken(`${post.id}:${config.services.newscatcher.postActionsSecret}`));
  const apiUrl = `${config.global.appServerUrl}:${
    config.global.appIsServerSecure ? config.global.appServerSecurePort : config.global.appServerPort
  }`;
  const ghostUrl = config.services.ghost.ghostApiUrl;

  try {
    sendMessage({
      to: recipients,
      subject: `News x Live - Post created!`,
      text: `
      <h1>${post.title}</h1>
      <p>
      <img src="${post.feature_image}" width="300px">
      </p>
      <h5>${post.tags.map(t => t.name).join(',')}</h5>
      ${renderMobileDoc(JSON.parse(post.mobiledoc))} 
      <p>
        <a target="_blank" style="${actionButtonStyle('rebeccapurple')}" href="${apiUrl}/posts/${post.id}/${token}/published">Publish?</a> 
        <a target="_blank" style="${actionButtonStyle('deeppink')}" href="${apiUrl}/posts/${post.id}/${token}/draft">Draft?</a>
        <a target="_blank" style="${actionButtonStyle('green')}" href="${ghostUrl}/ghost/#/editor/post/${post.id}">Edit?</a>
        <a target="_blank" style="${actionButtonStyle('red')}" href="${apiUrl}/posts/${post.id}/${token}/delete">Delete?</a>
      </p>`,
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const randomAuthor = async () => {
  const authors = await prepareAuthors();
  return authors[Math.floor(Math.random() * authors.length)];
};

const prepareAuthors = async () => {
  return config.services.ghost.ghostAuthors.split(';');
};

const getPost = async (id) => {
  const headers = await authHeaders();
  const url = `${config.services.ghost.ghostApiUrl}/ghost/api/v3/admin/posts`;
  const postsResponse = await axios.get(`${url}/${id}`, { headers });
  //console.log(postsResponse)
  return postsResponse.data.posts.find(p => p.id === id)
}

const deleteAllPosts = async () => {
  const headers = await authHeaders();
  const url = `${config.services.ghost.ghostApiUrl}/ghost/api/v3/admin/posts`;
  const postsResponse = await axios.get(`${url}?filter=status:'draft'&limit=all`, { headers });

  postsResponse.data.posts.forEach(async (post) => {
    if (post && post.id) {
      await deletePost(post.id);
    }
  });

  return 'deleteAllPosts has been queued!';
};

const deletePost = async (id) => {
  const headers = await authHeaders();
  const url = `${config.services.ghost.ghostApiUrl}/ghost/api/v3/admin/posts`;

  return await axios.delete(`${url}/${id}`, { headers });
};

const setPostStatus = async (id, status) => {
  const headers = await authHeaders();
  const url = `${config.services.ghost.ghostApiUrl}/ghost/api/v3/admin/posts`;

  let post = await getPost(id);
  if (post) {
    await axios.put(
      `${url}/${id}`,
      {
        posts: [
          {
            status: status,
            updated_at: post.updated_at
          },
        ],
      },
      { headers },
    );
  }
  else {
    throw new Error(`No posts found with id ${id}`);
  }
};

module.exports = {
  authHeaders,
  createPosts,
  getPost,
  setPostStatus,
  deletePost,
  deleteAllPosts,
};
