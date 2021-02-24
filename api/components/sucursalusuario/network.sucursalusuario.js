const express = require("express");
const response = require("../../../network/response");
const controller = require('./controller.sucursalusuario');


const router = express.Router();

// Routes
// router.get('/:email', getLocationsByEmail);
router.get('/', query);
router.get('/:id', get);
router.post('/', upsert);

// Internal functions
function getLocationsByEmail(req, res, next) {
  controller.getLocationsByEmail(req.query)
    .then(locations => {
      response.success(req, res, locations, 200);
    })
    .catch(next);
}

function get(req, res, next) {
  controller.get(req.params.id)
    .then(userLocations => {
      response.success(req, res, userLocations, 200);
    })
    .catch(next);
}

function query(req, res, next) {
  controller.query(req.query)
    .then(userLocations => {
      response.success(req, res, userLocations, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller.upsert(req.body)
    .then(userLocation => {
      response.success(req, res, userLocation, 201);
    })
    .catch(next);
}

module.exports = router;