const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const api = require('./api');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const port = 8000;

const mongoURI = 'mongodb://admin:password@localhost:27017/pixelboard?authSource=admin';

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté en local'))
.catch(err => console.error('❌ Erreur de connexion MongoDB :', err));

app.use(cors({
	origin: 'http://localhost:5173',
	credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api',  api);

app.listen(port, () => {
    console.log(`🚀 Serveur en ligne sur http://localhost:${port}`);
});
