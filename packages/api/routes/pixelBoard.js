const express = require('express');
const PixelBoard = require('../models/pixelBoard');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Récupérer tous les PixelBoards
router.get('/', async (req, res) => {
    try {
        const boards = await PixelBoard.find().populate("createdBy", "username");
        res.json(boards);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des PixelBoards', error });
    }
});

// Récupérer un PixelBoard par ID
router.get('/:id', async (req, res) => {
    try {
        const board = await PixelBoard.findById(req.params.id).populate("createdBy", "username");
        if (!board) {
            return res.status(404).json({ message: 'PixelBoard non trouvé' });
        }
        res.json(board);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération du PixelBoard', error });
    }
});

// Créer un nouveau PixelBoard (admin uniquement)
router.post('/', authMiddleware, async (req, res) => {
    try {
        if (req.userRole !== 'admin') {
            return res.status(403).json({ message: 'Seuls les administrateurs peuvent créer un PixelBoard.' });
        }

        const { title, size, mode, delayBetweenPixels, endTime } = req.body;
        const newBoard = new PixelBoard({
            title,
            size,
            mode,
            delayBetweenPixels,
            endTime,
            createdBy: req.userId
        });
        await newBoard.save();
        res.status(201).json(newBoard);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du PixelBoard', error });
    }
});


// Mettre à jour un PixelBoard par ID
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { title, size, mode, delayBetweenPixels, endTime } = req.body;
        const updatedBoard = await PixelBoard.findByIdAndUpdate(
            req.params.id,
            { title, size, mode, delayBetweenPixels, endTime },
            { new: true }
        );
        if (!updatedBoard) {
            return res.status(404).json({ message: 'PixelBoard non trouvé' });
        }
        res.json(updatedBoard);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour du PixelBoard', error });
    }
});

// Supprimer un PixelBoard par ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const deletedBoard = await PixelBoard.findByIdAndDelete(req.params.id);
        if (!deletedBoard) {
            return res.status(404).json({ message: 'PixelBoard non trouvé' });
        }
        res.json({ message: 'PixelBoard supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression du PixelBoard', error });
    }
});

module.exports = router;