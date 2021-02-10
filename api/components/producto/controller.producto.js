const TABLE = 'producto';
const store = require('../../../store/prisma');

async function getByBarcode(codigoBarras) {
  return store.get(TABLE);
}

async function get(id) {
  const product = await store.get(TABLE, id)
  return product 
}

// async function post(body) {
//   const product = await store.post(body);
//   return product;
// }

async function upsert(body) {
  const {
    //id,
    ingrediente_id,
    nombre,
    capacidad,
    codigo_barras,
    peso_nueva,
    precio
  } = body;

  // If product id is present, perform an update
  // TODO

  // Calculate crystal weight
  const ingredient = await store.get("ingrediente", ingrediente_id)
  const density = ingredient.densidad;
  const crystalWeight = Math.round(peso_nueva - (capacidad * density));

  payload = {
    ingrediente_id,
    nombre,
    capacidad,
    codigo_barras,
    peso_nueva,
    peso_cristal: crystalWeight,
    precio,
  }

  const product = await store.insert(TABLE, payload)
  return product
}

module.exports = {
  get,
  getByBarcode,
  //post,
  upsert
}