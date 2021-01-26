const TABLE = 'producto';
const store = require('../../../store/prisma/producto');

async function get(codigoBarras) {
  return store.get(TABLE);
}

function post(body) {
  return store.post(body);
}

module.exports = {
  get,
  post,
}