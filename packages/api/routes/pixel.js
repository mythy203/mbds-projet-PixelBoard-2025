const express = require('express');
const mongoose = require('mongoose');
const Pixel = require('../models/pixel');
const PixelBoard = require('../models/pixelBoard');
const { createCanvas } = require('canvas');

const router = express.Router();
const { enums } = require('../Enums/enums');

// Helper generate preview
async function generatePreview(boardId, size) {
    const pixels = await Pixel.find({ boardId });
  
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
  
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  
    pixels.forEach(({ x, y, color }) => {
      ctx.fillStyle = color || '#000';
      ctx.fillRect(x, y, 1, 1);
    });
  
    const scaleCanvas = createCanvas(200, 200);
    const scaleCtx = scaleCanvas.getContext('2d');
    scaleCtx.imageSmoothingEnabled = false;
    scaleCtx.drawImage(canvas, 0, 0, 200, 200);
  
    return scaleCanvas.toDataURL(); 
  }
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

        const now = new Date();
        if (now > board.endTime) {
            return res.status(403).json({
                error: enums.PixelStatus.BOARD_ENDED,
                message: "Ce PixelBoard est terminé. Impossible d'ajouter un pixel."
            });
        }

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

            // Generate preview and update PixelBoard
        const previewBase64 = await generatePreview(boardId, board.size);
        await PixelBoard.findByIdAndUpdate(boardId, { preview: previewBase64 });

        res.status(201).json(newPixel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post('/batch', async (req, res) => {
  try {
    const { pixels } = req.body;
    console.log("Pixels reçus :", pixels); // Log des pixels reçus

    if (!pixels || !Array.isArray(pixels) || pixels.length === 0) {
      return res.status(400).json({ message: "Le format des données est invalide" });
    }

    // Valider chaque pixel
    for (const pixel of pixels) {
      if (!pixel.boardId || typeof pixel.x !== 'number' || typeof pixel.y !== 'number' || !pixel.color) {
        return res.status(400).json({ message: "Un ou plusieurs pixels sont mal formatés" });
      }
    }

    // Traiter tous les pixels
    const promises = pixels.map(pixel => {
      return Pixel.findOneAndUpdate(
        { boardId: pixel.boardId, x: pixel.x, y: pixel.y },
        { ...pixel },
        { upsert: true, new: true }
      );
    });

    const results = await Promise.all(promises);
    res.status(200).json({ message: `${results.length} pixels ont été ajoutés avec succès` });
  } catch (error) {
    console.error("Erreur lors du traitement du lot de pixels :", error);
    res.status(500).json({ message: "Erreur lors du traitement du lot de pixels" });
  }
});

// GET /pixels/user/:userId - Contributions de l'utilisateur
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // On récupère tous les pixels de l'utilisateur avec les infos du board
    const pixels = await Pixel.find({ userId }).populate('boardId', 'title');

    // On groupe les contributions par boardId (utiliser une Map pour garder board et count)
    const contributionsMap = new Map();

    for (const pixel of pixels) {
      const board = pixel.boardId;
      if (!board) continue;

      const existing = contributionsMap.get(board._id.toString());
      if (existing) {
        existing.count++;
      } else {
        contributionsMap.set(board._id.toString(), {
          board: {
            _id: board._id,
            title: board.title
          },
          count: 1
        });
      }
    }

    const contributions = Array.from(contributionsMap.values());

    res.json({
      total: pixels.length,
      contributions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

  

module.exports = router;
