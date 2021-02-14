const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient();
const schema = process.env.DATABASE_URL?.split('?schema=')[1] || 'public'


async function seed() {
  const sql = await generateSQL()
  for (let statement of sql) {
    await prisma.$executeRaw(statement)
  }
}

seed()
  .then(() => console.log('seeded!'))
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

async function generateSQL() {

  const sql = `
  CREATE TABLE "${schema}"."cliente"
  (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    razon_social VARCHAR(255),
    rfc VARCHAR(255),
    direccion TEXT,
    ciudad VARCHAR(255)
  );

  CREATE TABLE "${schema}"."sucursal"
  (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER REFERENCES cliente(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    razon_social VARCHAR(255),
    rfc VARCHAR(255),
    direccion TEXT,
    ciudad VARCHAR(255),
    latitud NUMERIC(9,3),
    longitud NUMERIC(9,3),
    codigo_postal VARCHAR(5)
  );

  CREATE TABLE "${schema}"."categoria"
  (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL
  );

  CREATE TABLE "${schema}"."ingrediente"
  (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(255) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    categoria_id INTEGER REFERENCES categoria(id) ON DELETE CASCADE,
    densidad NUMERIC(3,2)
  );

  CREATE TABLE "${schema}"."receta"
  (
    id SERIAL PRIMARY KEY,
    codigo_pos VARCHAR(255) NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE 
  );

  CREATE TABLE "${schema}"."ingrediente_receta"
  (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER NOT NULL REFERENCES receta(id) ON DELETE CASCADE,
    ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
    volumen INTEGER NOT NULL,
    UNIQUE (receta_id, ingrediente_id)
  );

  CREATE TABLE "${schema}"."almacen"
  (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    numero INTEGER DEFAULT 1 NOT NULL,
    sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE
  );

  CREATE TABLE "${schema}"."caja"
  (
    id SERIAL PRIMARY KEY,
    numero INTEGER DEFAULT 1 NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    almacen_id INTEGER REFERENCES almacen(id) ON DELETE CASCADE
  );
  
  CREATE TABLE "${schema}"."venta" 
  (
    id SERIAL PRIMARY KEY,
    receta_id INTEGER REFERENCES receta(id) ON DELETE CASCADE,
    sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    cantidad INTEGER NOT NULL,
    importe INTEGER NOT NULL,
    caja_id INTEGER REFERENCES caja(id) ON DELETE CASCADE
  );

  CREATE TABLE "${schema}"."consumo" 
  (
    id SERIAL PRIMARY KEY,
    ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
    receta_id INTEGER REFERENCES receta(id) ON DELETE CASCADE,
    venta_id INTEGER REFERENCES venta(id) ON DELETE CASCADE,
    fecha DATE NOT NULL,
    volumen INTEGER NOT NULL
  );

  CREATE TABLE "${schema}"."producto" 
  (
    id SERIAL PRIMARY KEY,
    ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    capacidad INTEGER NOT NULL,
    codigo_barras VARCHAR(255) NOT NULL,
    peso_nueva INTEGER,
    peso_cristal INTEGER,
    precio NUMERIC(8,2)
  );


  CREATE TABLE "${schema}"."botella"
  (
    id SERIAL PRIMARY KEY,
    folio VARCHAR(255) NOT NULL UNIQUE,
    producto_id INTEGER REFERENCES producto(id) ON DELETE CASCADE,
    estado VARCHAR(255),
    fecha_registro TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_baja TIMESTAMP WITH TIME ZONE,
    sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE SET NULL,
    almacen_id INTEGER REFERENCES almacen(id) ON DELETE SET NULL,
    peso_nueva INTEGER,
    peso_cristal INTEGER,
    peso_inicial INTEGER,
    peso_actual INTEGER,
    precio INTEGER,
    nombre VARCHAR(255)
  );

  CREATE TABLE "${schema}"."usuario"
  (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) NOT NULL UNIQUE,
    name VARCHAR(255)
  );

  CREATE TABLE "${schema}"."auth"
  (
    id SERIAL PRIMARY KEY,
    email VARCHAR(40) NOT NULL UNIQUE, 
    password VARCHAR(255)
  );

  `
  return sql
    .split('\n')
    .filter((line) => line.indexOf('--') !== 0)
    .join('\n')
    .replace(/(\r\n|\n|\r)/gm, ' ')
    .replace(/\s+/g, ' ')
    .split(';')
    .map((sql) => sql.trim())
    .filter(Boolean)
}