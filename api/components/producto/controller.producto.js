const TABLE = 'producto';
const store = require('../../../store/prisma');

async function get(codigoBarras) {
  return store.get(TABLE);
}

module.exports = {
  get,
}