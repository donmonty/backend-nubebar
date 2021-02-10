const { PrismaClient } = require("@prisma/client")
const request = require('supertest')
const server = require('../api/server')
const axios = require('axios');

const prisma = new PrismaClient()

// beforeAll(async (done) => {
//   const categoryWhisky = await prisma.categoria.create({
//     data: {
//       nombre: 'Whisky'
//     }
//   })

//   const ingredientJWBlack = await prisma.ingrediente.create({
//     data: {
//       codigo: 'WHIS001',
//       nombre: 'Johnnie Walker Black',
//       densidad: 0.95,
//       categoria_id: categoryWhisky.id
//     }
//   }) 
//   done()
// })

afterAll(async (done) => {
  await prisma.$disconnect()
  done()
})

// test('A product is added successfully', async () => {
//   //expect.assertions(1);
//   // Create seed data for test
//   const categoryWhisky = await prisma.categoria.create({
//     data: {
//       nombre: 'Whisky'
//     }
//   })
//   expect(categoryWhisky.nombre).toEqual('Whisky')

//   const ingredientJWBlack = await prisma.ingrediente.create({
//     data: {
//       codigo: 'WHIS001',
//       nombre: 'Johnnie Walker Black',
//       densidad: 0.95,
//       categoria_id: categoryWhisky.id
//     }
//   })
//   expect(ingredientJWBlack.codigo).toEqual('WHIS001')  

  // Send payload to endpoint
  // const producto = await request(server)
  //   .post('/api/inventario/producto')
  //   .send({
  //     ingrediente_id: 1,
  //     //ingrediente_id: ingredientJWBlack.id,
  //     nombre: "Johnnie Walker Black 1000",
  //     capacidad: 1000,
  //     codigo_barras: "5000267125046",
  //     peso_nueva: 1478,
  //     precio: 801
  //   })
  //   .set('Accept', 'application/json')
  //   .expect('Content-Type', /json/)
  //   .expect(201)
  
  // expect(producto.error).toBeFalsy()
//})

describe('Without using Supertest', () => {

  const internalConfig = {}
  
  beforeEach(async (done) => {
    const instance = await server.listen({ port: 8080 });
    internalConfig.server = instance
    done()
  })

  afterEach(async (done) => {
    internalConfig.server.close()
    done()
  })

  test('Product creation, version B', async () => {
    const categoryWhisky = await prisma.categoria.create({
      data: {
        nombre: 'Whisky'
      }
    })
    const ingredientJWBlack = await prisma.ingrediente.create({
      data: {
        codigo: 'WHIS001',
        nombre: 'Johnnie Walker Black',
        densidad: 0.95,
        categoria_id: categoryWhisky.id
      }
    })
    const producto = await axios.post('http://localhost:8080/api/inventario/producto', {
      //ingrediente_id: 1,
      ingrediente_id: ingredientJWBlack.id,
      nombre: "Johnnie Walker Black 1000",
      capacidad: 1000,
      codigo_barras: "5000267125046",
      peso_nueva: 1478,
      precio: 801
    })
    expect.assertions(1)
    expect(producto.error).toBeFalsy()

  })
})



