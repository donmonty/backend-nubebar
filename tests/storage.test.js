const { PrismaClient } = require('@prisma/client');
const server = require('../api/server');
const axios = require('axios');

const prisma = new PrismaClient();
const internalConfig = {};
const baseURL = 'http://localhost:8080/api/storage';

beforeAll(async () => {
  const instance = server.listen({port: 8080});
  internalConfig.server = instance;

  // Seed DB with necessary data
  const customer = await prisma.cliente.create({
    data: {
      nombre: 'Hyrule Corporation'
    }
  });
  const location = await prisma.sucursal.create({
    data: {
      nombre: 'Link Burgers',
      cliente_id: customer.id
    }
  })
  const storage1 = await prisma.almacen.create({
    data: {
      nombre: 'Barra 1',
      numero: 1,
      sucursal_id: location.id
    }
  })
  const storage2 = await prisma.almacen.create({
    data: {
      nombre: 'Barra 2',
      numero: 2,
      sucursal_id: location.id
    }
  })

  internalConfig.customer = customer;
  internalConfig.location = location;
  internalConfig.storage1 = storage1;
  internalConfig.storage2 = storage2;
})
afterAll(async (done) => {
  await prisma.$disconnect();
  internalConfig.server.close();
  done();
})

test('Fetch all storage locations', async () => {
  const storageLocations = await axios.get(baseURL);
  expect(storageLocations.status).toEqual(200);
  expect(storageLocations.data.body.length).toEqual(2);
})

test('Fetch storage location by id', async () => {
  const storageLocations = await axios.get(baseURL, { params: { id: internalConfig.storage1.id } });
  expect(storageLocations.status).toEqual(200);
  expect(storageLocations.data.body.length).toEqual(1);
})



