//import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

// Experimental function only
async function getLocationsByEmail(table, userId) {
  const data = await prisma[table].findMany({
    where: {id: userId}
  });
  return data;
}

async function getByBarcode(table, id) {
  if (table === 'producto') {
    const data = await prisma.producto.findFirst({
      where: { codigo_barras: id}
    })
    return data;
  }
}

async function query(table, query) {

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  if (isEmpty(query)) {
    return list(table);
  }

  function formatQuery(query) {
    const parameters = {}
    for(let key in query) {
      if(isNaN(query[key])) {
        parameters[key] = query[key];
      } else {
        parameters[key] = parseInt(query[key]);
      }
    }
    return parameters;
  }

  const filters = formatQuery(query);
  const queryObject = { where: {...filters}};
  const data = await prisma[table].findMany(queryObject)
  return data;
}

async function list(table) {
  const data = await prisma[table].findMany()
  return data;
}

async function get(table, id) {
  const data = await prisma[table].findFirst({
    where: {id: id}
  })
  return data
}

async function insert(table, payload) {
  const data = await prisma[table].create({
    data: payload
  })
  return data
}

async function update(table, payload) {
  const data = await prisma[table].update({
    where: {id: payload.id},
    data: payload
  })
  return data;
}

async function upsert(table, payload) {
  if (payload.id) {
    return await update(table, payload);
  } else {
    return insert(table, payload);
  }
}

async function post(body) {
  const {
    ingrediente_id,
    nombre,
    capacidad,
    codigo_barras,
    peso_nueva,
    precio
  } = body;

  // Calculate empty bottle weight
  const ingredient = await prisma.ingrediente.findUnique({
    where: {id: ingrediente_id}
  })
  const density = ingredient.densidad;
  const crystalWeight = Math.round(peso_nueva - (capacidad * density));
  
  // Create product and save it to database
  const product = await prisma.producto.create({
    data: {
      ingrediente_id,
      nombre,
      capacidad,
      codigo_barras,
      peso_nueva,
      peso_cristal: crystalWeight,
      precio,
    }
  })
  return product;
}


module.exports = {
  get,
  getByBarcode,
  list,
  post,
  insert,
  prisma,
  query,
  upsert,
  getLocationsByEmail
}