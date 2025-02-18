const express = require('express');

const api = express.Router();

module.exports = api;

const pixelAPI = require('./routes/pixel');
api.use('/pixels', pixelAPI);
