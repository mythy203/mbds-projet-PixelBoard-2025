const express = require('express');
const PixelBoard = require('../models/pixelBoard');
const router = express.Router();

// Utilisateur temporaire (à remplacer par req.user._id plus tard)
const TEMP_USER_ID = "64b1234567abcdef890abcd1";

// Récupérer tous les PixelBoards
router.get('/', async (req, res) => {
    const boards = await PixelBoard.find().populate("createdBy", "username");
    res.json(boards);
});




module.exports = router;
