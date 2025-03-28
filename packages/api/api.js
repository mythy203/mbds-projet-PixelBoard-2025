const express = require('express');
const api = express.Router();

const pixelAPI = require('./routes/pixel');
api.use('/pixels', pixelAPI);

const pixelBoardAPI = require('./routes/pixelBoard');
api.use('/pixelboards', pixelBoardAPI);

const userRoutes = require('./routes/user');
api.use('/users', userRoutes); 
module.exports = api;
