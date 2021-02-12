/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE cliente (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      razon_social VARCHAR(255),
      rfc VARCHAR(255),
      direccion TEXT,
      ciudad VARCHAR(255)
    );

    CREATE TABLE sucursal (
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

    CREATE TABLE categoria (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL
    );

    CREATE TABLE ingrediente (
      id SERIAL PRIMARY KEY,
      codigo VARCHAR(255) NOT NULL UNIQUE,
      nombre VARCHAR(255) NOT NULL,
      categoria_id INTEGER REFERENCES categoria(id) ON DELETE CASCADE,
      densidad NUMERIC(3,2)
    );

    CREATE TABLE receta (
      id SERIAL PRIMARY KEY,
      codigo_pos VARCHAR(255) NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE 
    );

    CREATE TABLE ingrediente_receta (
      id SERIAL PRIMARY KEY,
      receta_id INTEGER NOT NULL REFERENCES receta(id) ON DELETE CASCADE,
      ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
      volumen INTEGER NOT NULL,
      UNIQUE (receta_id, ingrediente_id)
    );

    CREATE TABLE almacen (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      numero INTEGER DEFAULT 1 NOT NULL,
      sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE
    );

    CREATE TABLE caja (
      id SERIAL PRIMARY KEY,
      numero INTEGER DEFAULT 1 NOT NULL,
      nombre VARCHAR(255) NOT NULL,
      almacen_id INTEGER REFERENCES almacen(id) ON DELETE CASCADE
    );

    CREATE TABLE venta (
      id SERIAL PRIMARY KEY,
      receta_id INTEGER REFERENCES receta(id) ON DELETE CASCADE,
      sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE,
      fecha DATE NOT NULL,
      cantidad INTEGER NOT NULL,
      importe INTEGER NOT NULL,
      caja_id INTEGER REFERENCES caja(id) ON DELETE CASCADE
    );

    CREATE TABLE consumo (
      id SERIAL PRIMARY KEY,
      ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
      receta_id INTEGER REFERENCES receta(id) ON DELETE CASCADE,
      venta_id INTEGER REFERENCES venta(id) ON DELETE CASCADE,
      fecha DATE NOT NULL,
      volumen INTEGER NOT NULL
    );

    CREATE TABLE producto (
      id SERIAL PRIMARY KEY,
      ingrediente_id INTEGER REFERENCES ingrediente(id) ON DELETE CASCADE,
      nombre VARCHAR(255) NOT NULL,
      capacidad INTEGER NOT NULL,
      codigo_barras VARCHAR(255) NOT NULL,
      peso_nueva INTEGER,
      peso_cristal INTEGER,
      precio NUMERIC(8,2)
    );

    CREATE TABLE botella (
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

    CREATE TABLE usuario (
      id SERIAL PRIMARY KEY,
      email VARCHAR(40) NOT NULL UNIQUE,
      name VARCHAR(255)
    );

    CREATE TABLE auth (
      id SERIAL PRIMARY KEY,
      email VARCHAR(40) NOT NULL UNIQUE, 
      password VARCHAR(255)
    );

  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE auth;
    DROP TABLE user;
    DROP TABLE botella;
    DROP TABLE producto;
    DROP TABLE consumo;
    DROP TABLE venta;
    DROP TABLE caja;
    DROP TABLE almacen;
    DROP TABLE ingrediente_receta;
    DROP TABLE receta;
    DROP TABLE ingrediente;
    DROP TABLE categoria;
    DROP TABLE sucursal;
    DROP TABLE cliente;
  `)
};
