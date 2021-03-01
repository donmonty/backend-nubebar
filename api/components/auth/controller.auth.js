const bcrypt = require('bcrypt');

const store = require('../../../store/prisma')
const auth = require('../../../auth');
const TABLE = 'auth';

async function login(email, password) {
  const data = await store.getUserByEmail(TABLE, email);
  const checkPassword = await bcrypt.compare(password, data.password)
  if (checkPassword === true) return auth.sign({ ...data });

  throw new Error('Invalid login data');
}

async function upsert(data) {
  const { id, email, password } = data;
  const authData = {};

  if (id) {
    authData.id = id;
  }

  if (email) {
    authData.email = email;
  }

  if (password) {
    authData.password = await bcrypt.hash(password, 5);
  }

  return store.upsert(TABLE, authData);
}

module.exports = {
  login,
  upsert
}