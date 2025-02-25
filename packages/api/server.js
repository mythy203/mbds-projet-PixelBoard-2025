const express = require("express");
const cors = require("cors");
const connectDB = require("./database"); //  Importer la connexion MongoDB
const apiRoutes = require("./api"); //  Importer `api.js`

const app = express();
app.use(cors());
app.use(express.json()); //  Pour lire les requêtes JSON

connectDB(); //  Connexion à MongoDB

app.use("/api", apiRoutes); //  Utilisation des routes API

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(` Serveur lancé sur http://localhost:${PORT}`);
});
