const express = require('express');

const response = require('../../../network/response');
const controller = require('./controller.location');

const router = express.Router();

// Routes
router.get('/storage', getLocationStorage);
router.get('/', query);
router.post('/', upsert);

// Internal functions
function getLocationStorage(req, res, next) {
  controller.getLocationStorage(req.query)
    .then(location => {
      response.success(req, res, location, 200);
    })
    .catch(next);
}

function query(req, res, next) {
  controller.query(req.query)
    .then(locations => {
      response.success(req, res, locations, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller.upsert(req.body)
    .then(location => {
      response.success(req, res, location, 201);
    })
    .catch(next);
}

module.exports = router;