const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Assurez-vous de créer un modèle User

const router = express.Router();
const secret = 'your_jwt_secret'; // Remplacez par une clé secrète sécurisée

// Route de création de compte
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role : role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created' });
});

// Route de connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true });
    res.json({ message: 'Logged in' });
});

module.exports = router;