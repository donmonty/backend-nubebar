const jwt = require('jsonwebtoken');
const config = require('../config')

const secret = config.jwt.secret;

function sign(data) {
  return jwt.sign(data, secret);
}

function verify(token) {
  return jwt.verify(token, secret);
}

const check = {
  logged: function (req, owner) {
    const decoded = decodeHeader(req);
  },
}

function getToken(auth) {
  if (!auth) {
    throw new Error('Token is missing')
  }

  if (auth.indexOf('Bearer ') === -1) {
    throw new Error('Invalid token format');
  }

  let token = auth.replace('Bearer ', '');
  return token;
}

function decodeHeader(req) {
  const authorization = req.headers.authorization || '';
  const token = getToken(authorization);
  const decoded = verify(token);

  return decoded;
}

module.exports = {
  sign,
  check
}


