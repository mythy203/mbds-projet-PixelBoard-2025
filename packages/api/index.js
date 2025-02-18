const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const api = require('./api');

const app = express();
const port = 8000;  // Port fixé

// Connexion à MongoDB avec une valeur par défaut
const mongoURI = 'mongodb://admin:password@localhost:27017/pixelboard?authSource=admin';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté en local'))
.catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

app.use(cors());
app.use(express.json());

app.use('/api', api);

app.listen(port, () => {
    console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
