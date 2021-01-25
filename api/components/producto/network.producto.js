const express = require("express");
const response = require("../../../network/response");
const controller = require('./controller.producto')

//const { PrismaClient } = require("@prisma/client")

//const prisma = new PrismaClient()

const router = express.Router()

// Routes
router.get('/:codigoBarras', get)

//Internal functions
function get(req, res, next) {
  controller.get(req.params.codigoBarras)
    .then(producto => {
      response.success(req, res, producto, 200)
    })
    .catch(next);
}

// async function getProducto(id) {
//   const data = await prisma.producto.findFirst({
//     where: { codigo_barras: id}
//   })
//   return data;
// }


// function get(req, res, next) {
//   const barcode = req.params.codigoBarras;
//   //console.log('Req Params:', req.params);
//   console.log('Type Barcode:', typeof(barcode));
//   getProducto(barcode)
//     .then(producto => {
//       response.success(req, res, producto, 200);
//     })
//     .catch(next);
// }

module.exports = router;