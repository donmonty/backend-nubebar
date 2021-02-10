const express = require("express");

const sat = require("./components/sat/sat.network");
const producto = require('./components/producto/network.producto')
const errors = require('../network/errors');

const app = express();

app.use(express.json());

// ROUTES
app.use('/api/inventario/producto', producto);
app.use("/api/sat", sat);
app.use("/", (req, res, next) => {
  res.send("Hello world, motherfuckers!");
});

app.use(errors);

module.exports = app;