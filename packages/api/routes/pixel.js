const express = require('express');
const mongoose = require('mongoose');
const Pixel = require('../models/pixel');
const PixelBoard = require('../models/pixelBoard');

const router = express.Router();
const { enums } = require('../Enums/enums');

//Récupérer tous les pixels d'un PixelBoard
router.get('/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const pixels = await Pixel.find({ boardId: mongoose.Types.ObjectId(boardId) });
        res.json(pixels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter un pixel avec vérification du délai
router.post('/', async (req, res) => {
    try {
        const { boardId, x, y, color, userId } = req.body;
		const board = await PixelBoard.findById(boardId);
		const delayBetweenPixels = board.get('delayBetweenPixels');

        // Vérifier le délai entre les actions
        const lastPixel = await Pixel.findOne({ userId, boardId }).sort({ createdAt: -1 });

        if (lastPixel) {
            const now = new Date();
            const timeDiff = (now - lastPixel.createdAt) / 1000; // Différence en secondes

            if (timeDiff < delayBetweenPixels) {
                return res.status(200).json({ error: enums.PixelStatus.DELAY_NOT_RESPECTED, message: `Attendez ${delayBetweenPixels - timeDiff} secondes avant de dessiner à nouveau` });
            }
        }

        // Ajouter le nouveau pixel
        const newPixel = new Pixel({ boardId, x, y, color, createdAt: new Date(), userId });
        await newPixel.save();

        res.status(201).json(newPixel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /pixels/user/:userId - Contributions de l'utilisateur
router.get('/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Trouver tous les pixels créés par l'utilisateur
      const pixels = await Pixel.find({ userId }).populate('boardId', 'title');
  
      // Grouper les pixels par PixelBoard
      const contributionsMap = {};
      for (const pixel of pixels) {
        const boardTitle = pixel.boardId?.title || "Inconnu";
        if (!contributionsMap[boardTitle]) {
          contributionsMap[boardTitle] = 0;
        }
        contributionsMap[boardTitle]++;
      }
  
      const contributions = Object.entries(contributionsMap).map(([board, count]) => ({
        board,
        count,
      }));
  
      res.json({
        total: pixels.length,
        contributions,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

module.exports = router;
