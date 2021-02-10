//import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function getByBarcode(table, id) {
  if (table === 'producto') {
    const data = await prisma.producto.findFirst({
      where: { codigo_barras: id}
    })
    return data;
  }
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
  post,
  insert,
  prisma
}