const auth = require('../auth/controller.auth');
const store = require('../../../store/prisma')
const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

const TABLE = 'usuario';

async function getUserLocations(id) {
  const user = await prisma.usuario.findUnique({
    where: { id: id },
    include: {
      sucursal_usuario: {
        include: { sucursal: true }
      }
    }
  })
  return user;
}

async function getLocations(query) {
  const models = ['sucursal_usuario', 'sucursal'];
  const data = store.getRelatedExplicit(TABLE, models, +query.id);
  
  return data;
}

async function list() {
  return store.list(TABLE);
}

async function get(id) {
  return store.get(TABLE, +id);
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
  getLocations,
  getUserLocations
}