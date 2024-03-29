const { PrismaClient } = require("@prisma/client");
const server = require('../api/server');
const axios = require('axios');
// const { create } = require('apisauce');

const prisma = new PrismaClient();

const internalConfig = {};
const url = 'http://localhost:8080/api/sucursal-usuario';

beforeAll(async () => {
  // Start server and put it inside a global object
  const instance = server.listen({ port: 8080 });
  internalConfig.server = instance

  // Create seed data for the test and place it
  // inside a global object for easy access
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

  const location2 = await prisma.sucursal.create({
    data: {
      nombre: 'Zelda Tacos',
      cliente_id: customer.id
    }
  })

  const dummyUser = await prisma.usuario.create({
    data: {
      email: 'link@zelda.com',
      name: 'link'
    }
  });

  const dummyUserLocation = await prisma.sucursal_usuario.create({
    data: {
      usuario_id: dummyUser.id,
      sucursal_id: location2.id
    }
  })

  internalConfig.customer = customer;
  internalConfig.location = location;
  internalConfig.location2 = location2;
  internalConfig.dummyUser = dummyUser;
  internalConfig.dummyUserLocation = dummyUserLocation;
})

afterAll(async (done) => {
  await prisma.$disconnect()
  internalConfig.server.close()
  done()
})


test('A user location is created successfully', async () => {
  const userLocation = await axios.post(url, {
    usuario_id: internalConfig.dummyUser.id,
    sucursal_id: internalConfig.location.id
  });
  // console.log('CREATED USER LOCATION:', userLocation.data)
  expect(userLocation.status).toEqual(201);
  expect(userLocation.data.error).toBeFalsy();
})

test('All user locations are retrieved successfully', async () => {
  const userLocations = await axios.get(url);
  // console.log('USER LOCATIONS:', userLocations.data)
  expect(userLocations.status).toEqual(200);
  expect(userLocations.data.error).toBeFalsy();
})

test('A user location is retrieved successfully', async () => {
  
  const location3 = await prisma.sucursal.create({
    data: {
      nombre: 'Hyrule Pizza',
      cliente_id: internalConfig.customer.id
    }
  })
  const userLocation3 = await prisma.sucursal_usuario.create({
    data: {
      usuario_id: internalConfig.dummyUser.id,
      sucursal_id: location3.id
    }
  })
  const allLocations = await axios.get(url, {params: {usuario_id: internalConfig.dummyUser.id}});
  // const api = create({baseURL: 'http://localhost:8080/api'});
  // const allLocations = await api.get('/sucursal-usuario', {usuario_id: 1})

  // console.log('LOCATIONS USING AXIOS', allLocations.data);
  expect(allLocations.status).toEqual(200);
  expect(allLocations.data.error).toBeFalsy();
})


