// routes/user.js
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/users');

const router = express.Router();

// Liste des utilisateurs (déjà présent)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, 'username role');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// 🔄 Route pour modifier les infos d’un utilisateur
router.put('/:id', async (req, res) => {
  const { username, password } = req.body;
  const updateFields = {};
  if (username) updateFields.username = username;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateFields.password = await bcrypt.hash(password, salt);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json({ message: 'Profil mis à jour avec succès', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
  }
});

module.exports = router;
