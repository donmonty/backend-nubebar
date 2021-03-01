const store = require('../../../store/prisma')

const TABLE = 'almacen';

function query(query) {
  return store.query(TABLE, query);
}

function upsert(body) {
  return store.upsert(TABLE, body);
}

module.exports = {
  query,
  upsert
}