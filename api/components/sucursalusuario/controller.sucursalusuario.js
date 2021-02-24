const TABLE = 'sucursal_usuario';
const store = require('../../../store/prisma');

async function getLocationsByEmail(query) {
  // Get user who matches email
  const user = await store.query('usuario', query);
  console.log('QUERY USER:', user);
  return store.query(TABLE, {usuario_id: user.id});
}

async function get(id) {
  const userLocations = await store.list(TABLE, id);
  return userLocations;
}

async function query(query) {
  const userLocation = await store.query(TABLE, query);
  return userLocation;
}

async function upsert(body) {
  const userLocation = await store.upsert(TABLE, body);
  return userLocation;
}

module.exports = {
  getLocationsByEmail,
  get,
  upsert,
  query,
}