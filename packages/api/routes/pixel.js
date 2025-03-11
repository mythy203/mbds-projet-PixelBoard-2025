const express = require('express');
const mongoose = require('mongoose');
const Pixel = require('../models/pixel');

const router = express.Router();

// Ajouter un pixel à un PixelBoard
router.post('/add', async (req, res) => {
    try {
        const { boardId, x, y, color, userId } = req.body;
        const newPixel = new Pixel({ boardId, x, y, color, userId });
        await newPixel.save();
        res.status(201).json(newPixel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

//  Récupérer tous les pixels d'un PixelBoard
router.get('/:boardId', async (req, res) => {
    try {
        const { boardId } = req.params;
        const pixels = await Pixel.find({ boardId: mongoose.Types.ObjectId(boardId) });
        res.json(pixels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//  Ajouter un pixel avec vérification du délai
router.post('/', async (req, res) => {
    try {
        const { boardId, x, y, color, userId } = req.body;

        // Vérifier le délai entre les actions
        const lastPixel = await Pixel.findOne({ userId, boardId }).sort({ createdAt: -1 });

        if (lastPixel) {
            const now = new Date();
            const timeDiff = (now - lastPixel.createdAt) / 1000; // Différence en secondes

            if (timeDiff < 10) { // 10 secondes d'attente
                return res.status(400).json({ message: `Attendez ${10 - timeDiff} secondes avant d'ajouter un pixel.` });
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

module.exports = router;
