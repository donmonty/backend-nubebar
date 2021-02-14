const auth = require('../auth/controller.auth');
const store = require('../../../store/prisma')

const TABLE = 'usuario';

async function list() {
  return store.list(TABLE);
}

async function get(id) {
  return store.get(TABLE, id);
}

async function query(query) {
  return store.query(TABLE, query);
}

async function upsert(payload) {
  const { id, name, email, password } = payload;
  const user = {
    id,
    email,
    name
  }

  if (email || password) {
    await auth.upsert({
      id,
      email,
      password,
    })
  }

  return await store.upsert(TABLE, user)
}

module.exports = {
  list,
  get,
  query,
  upsert,
}