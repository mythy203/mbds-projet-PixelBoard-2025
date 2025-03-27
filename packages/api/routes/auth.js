const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/users'); // Assurez-vous de créer un modèle User

const router = express.Router();
const secret = 'your_jwt_secret'; // Remplacez par une clé secrète sécurisée

// Route de création de compte
router.post('/signup', async (req, res) => {
    const { username, password, role } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role: role || 'user' });
    await user.save();
    res.status(201).json({ message: 'User created' });
});

// Connexion
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '1h' });
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // false en local sans HTTPS
        sameSite: 'Lax'
      });
  
      res.json({
        message: 'Logged in',
        role: user.role // ✅ renvoie le rôle ici
      });
    } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true, // mettre false en local sans HTTPS
        sameSite: 'Lax'
    });
    res.json({ message: 'Logged out' });
});


// Route pour récupérer les informations de l'utilisateur connecté
router.get('/me', async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId).select('username role');
        res.json(user);
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
});

module.exports = router;