const express = require('express');

const response = require('../../../network/response');
const controller = require('./controller.storage');

const router = express.Router();

// Routes
router.get('/', query);
router.post('/', upsert);

// Internal functions
function query(req, res, next) {
  controller.query(req.query)
    .then(storage => {
      response.success(req, res, storage, 200);
    })
    .catch(next);
}

function upsert(req, res, next) {
  controller.upsert(re.body)
    .then(storage => {
      response.success(req, res, storage, 201);
    })
    .catch(next);
}

module.exports = router;
