const { PrismaClient } = require('@prisma/client');
const server = require('../api/server');
const axios = require('axios');

const prisma = new PrismaClient();

const internalConfig = {};
const baseURL = 'http://localhost:8080/api/usuario';


beforeAll(() => {
  const instance = server.listen({port: 8080});
  internalConfig.server = instance;
})
afterAll(async (done) => {
  await prisma.$disconnect();
  internalConfig.server.close();
  done();
})

describe('Fetching locations assigned to a user', () => {
  beforeEach(async () => {

    // Seed database with necessary data
    const customer = await prisma.cliente.create({
      data: {
        nombre: 'Hyrule Corporation'
      }
    });
  
    const location1 = await prisma.sucursal.create({
      data: {
        nombre: 'Link Burgers',
        cliente_id: customer.id
      }
    })
  
    const location2 = await prisma.sucursal.create({
      data: {
        nombre: 'Zelda Bar',
        cliente_id: customer.id
      }
    })
  
    const user1 = await prisma.usuario.create({
      data: {
        email: 'link@zelda.com',
        name: 'link'
      }
    });
  
    const userLocation1 = await prisma.sucursal_usuario.create({
      data: {
        usuario_id: user1.id,
        sucursal_id: location1.id
      }
    })
  
    const userLocation2 = await prisma.sucursal_usuario.create({
      data: {
        usuario_id: user1.id,
        sucursal_id: location2.id
      }
    })

    internalConfig.user1 = user1;
    internalConfig.customer = customer;
    internalConfig.location1 = location1;
    internalConfig.location2 = location2;
    internalConfig.userLocation1 = userLocation1;
    internalConfig.userLocation2 = userLocation2;
  })

  test('Fetch assigned locations for one user', async () => {
    const route = '/locations';
    const url = baseURL + route;
    const locations = await axios.get(url + `/${internalConfig.user1.id}`);
    //console.log(locations.data);
    expect(locations.status).toEqual(200);
    expect(locations.data.body.length).toEqual(2);
  })
})