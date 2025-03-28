// routes/user.js
const express = require('express');
const User = require('../models/users');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

module.exports = router;
