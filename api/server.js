const express = require("express");

const sat = require("./components/sat/sat.network");
const producto = require('./components/producto/network.producto')
const usuario = require('./components/usuario/network.usuario')
const auth = require('./components/auth/network.auth')
const errors = require('../network/errors');
const sucursalUsuario = require('./components/sucursalusuario/network.sucursalusuario');

const app = express();

app.use(express.json());

// ROUTES
app.use('/api/usuario', usuario);
app.use('/api/inventario/producto', producto);
app.use('/api/auth', auth);
app.use("/api/sat", sat);
app.use('/api/sucursal-usuario', sucursalUsuario);
app.use("/", (req, res, next) => {
  res.send("Hello world, motherfuckers!");
});

app.use(errors);

module.exports = app;