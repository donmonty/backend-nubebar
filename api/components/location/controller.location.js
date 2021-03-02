const store = require('../../../store/prisma')

const TABLE = 'sucursal';

function getLocationStorage(query) {
  return store.getRelated(TABLE, 'almacen', +query.id);
}

function query(query) {
  return store.query(TABLE, query);
}

function upsert(body) {
  return store.upsert(TABLE, body);
}

module.exports = {
  getLocationStorage,
  query,
  upsert,
}