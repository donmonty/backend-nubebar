const express = require("express");
const response = require("../../../network/response");
const controller = require('./controller.producto')
//const store = require('../../../store/prisma/producto')

//const { PrismaClient } = require("@prisma/client")

//const prisma = new PrismaClient()

const router = express.Router()

// Routes
router.get('/:id', get)
router.get('/:codigoBarras', getByBarcode);
//router.post('/', post);
router.post('/', upsert);

//Internal functions
function get(req, res, next) {
  controller.get(req.params)
    .then(data => {
      response.success(req, res, data, 200)
    })
    .catch(next)
}


function getByBarcode(req, res, next) {
  controller.get(req.params.codigoBarras)
    .then(producto => {
      response.success(req, res, producto, 200)
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller.upsert(req.body)
    .then(producto => {
      response.success(req, res, producto, 201)
    })
    .catch(next)
}

// function post(req, res, next) {
//   controller.post(req.body)
//     .then(producto => {
//       response.success(req, res, producto, 201);
//     })
//     .catch(next);
// }

// function post(req, res, next) {
//   store.post(req.body)
//     .then(producto => {
//       response.success(req, res, producto, 201)
//     })
//     .catch(next)
// }

// router.post('/', async function post(req, res, next) {
//   try {
//     const producto = await controller.post(req.body)
//     response.success(req, res, producto, 201)
//   } catch (next) {
//     console.log('Algo salio mal.')
//   }
// })

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