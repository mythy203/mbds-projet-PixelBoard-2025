import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import api from './api.js';
import authRoutes from './routes/auth.js';
import authMiddleware from './middleware/auth.js';
import pixelRoutes from './routes/pixel.js'; //  Ajout ici

const app = express();
const port = 8000;

const mongoURI = 'mongodb://admin:password@localhost:27017/pixelboard?authSource=admin';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(' MongoDB connecté en local'))
.catch(err => console.error(' Erreur de connexion MongoDB :', err));

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api', authMiddleware, api);
app.use('/api/pixels', pixelRoutes); //  Placement correct de la route

//  Lancement du serveur
app.listen(port, () => {
    console.log(` Serveur en ligne sur http://localhost:${port}`);
});
