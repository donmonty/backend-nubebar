/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE sucursal_usuario (
      id SERIAL PRIMARY KEY,
      usuario_id INTEGER REFERENCES usuario(id) ON DELETE CASCADE,
      sucursal_id INTEGER REFERENCES sucursal(id) ON DELETE CASCADE,
      UNIQUE(usuario_id, sucursal_id)
    );
  `)
};

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE sucursal_usuario;
  `)
};
