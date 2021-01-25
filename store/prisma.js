//import { PrismaClient } from '@prisma/client'
const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

async function get(table, id) {
  if (table === 'producto') {
    const data = await prisma.producto.findFirst({
      where: { codigo_barras: id}
    })
    return data;
  }
}


module.exports = {
  get,
}