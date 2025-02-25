const express = require("express");
const api = express.Router();

const pixelAPI = require("./routes/pixel");
const authAPI = require("./routes/auth"); //  Route d'authentification

// Ajout des routes
api.use("/pixels", pixelAPI);
api.use("/auth", authAPI);

module.exports = api;


