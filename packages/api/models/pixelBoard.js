const mongoose = require('mongoose');

const PixelBoardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    size: { type: Number, required: true }, // Taille de la grille (ex: 10x10)
    mode: { type: Boolean, default: true }, // Autoriser ou non de dessiner par-dessus un pixel existant
    delayBetweenPixels: { type: Number, default: 10 }, // Délai entre chaque pixel (en secondes)
    status: { type: String, enum: ["en cours", "terminée"], default: "en cours" },
    createdAt: { type: Date, default: Date.now },
    endTime: { type: Date }, // Date de fermeture du board
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true } // ID de l'utilisateur qui crée le PixelBoard
});

module.exports = mongoose.model("PixelBoard", PixelBoardSchema);