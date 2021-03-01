const express = require('express');

// TODO: Add secure module

const response = require('../../../network/response');
const controller = require('./controller.usuario');

const router = express.Router();

// Routes
//router.get('/', list);
router.get('/locations', getLocations);
router.get('/:id', get);
router.get('/', query);
router.post('/', upsert);
router.put('/', upsert);
// router.get('/locations/:id', getLocations)


// Internal functions
function getLocations(req, res, next) {
  controller.getLocations(req.query)
  // controller.getLocations(req.params.id)
    .then(locations => {
      response.success(req, res, locations, 200);
    })
    .catch(next);
}

function query(req, res, next) {
  controller.query(req.query)
    .then(users => {
      response.success(req, res, users, 200);
    })
    .catch(next)
}

function list(req, res, next) {
  controller.list()
    .then(users => {
      response.success(req, res, users, 200);
    })
    .catch(next)
}

function get(req, res, next) {
  controller.get(req.params.id)
    .then(user => {
      response.success(req, res, user, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller.upsert(req.body)
    .then(user => {
      response.success(req, res, user, 201);
    })
    .catch(next);
}

module.exports = router;