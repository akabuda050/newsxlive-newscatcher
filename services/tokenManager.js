const jwt = require('jsonwebtoken');

const generateToken = (key) => {
  // Split the key into ID and SECRET
  const [id, secret] = key.split(':');

  // Create the token (including decoding secret)
  return jwt.sign({}, Buffer.from(secret, 'hex'), {
    keyid: id,
    algorithm: 'HS256',
    expiresIn: 10800,
  });
};

const verifyToken = (token, secret) => {
  try {
    return !!jwt.verify(token, Buffer.from(secret, 'hex'), { algorithms: ['HS256'] });
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
