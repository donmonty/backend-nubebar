const express = require('express');
const response = require('../../../network/response');
const controller = require('./controller.auth');

const router = express.Router();

// Routes
router.post('/login', login);

function login(req, res, next) {
  controller.login(req.body.email, req.body.password)
    .then(token => {
      response.success(req, res, token, 200);
    })
    .catch(next);
}

module.exports = router;