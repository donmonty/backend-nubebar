const { PrismaClient } = require('@prisma/client');
const server = require('../api/server');
const axios = require('axios');

const prisma = new PrismaClient();
const internalConfig = {};
const baseURL = 'http://localhost:8080/api/location';

beforeAll(async () => {
  const instance = server.listen({port: 8080});
  internalConfig.server = instance;

  // Seed DB with necessary data
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
  const storage1 = await prisma.almacen.create({
    data: {
      nombre: 'Barra 1',
      numero: 1,
      sucursal_id: location1.id
    }
  })
  const storage2 = await prisma.almacen.create({
    data: {
      nombre: 'Barra 2',
      numero: 2,
      sucursal_id: location1.id
    }
  })

  internalConfig.customer = customer;
  internalConfig.location1 = location1;
  internalConfig.location2 = location2;
  internalConfig.storage1 = storage1;
  internalConfig.storage2 = storage2;
})
afterAll(async (done) => {
  await prisma.$disconnect();
  internalConfig.server.close();
  done();
})

test('Fetch all locations', async () => {
  const locations = await axios.get(baseURL);
  expect(locations.status).toEqual(200);
  expect(locations.data.body.length).toEqual(2);
})

test('Fetch storage rooms for a specific location', async () => {
  const url = '/storage';
  const storageLocations = await axios.get(baseURL + url, { params: { id: internalConfig.location1.id } });
  expect(storageLocations.status).toEqual(200);
  expect(storageLocations.data.body.length).toEqual(2);
})