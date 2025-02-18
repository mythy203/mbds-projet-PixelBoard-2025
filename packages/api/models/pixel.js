const mongoose = require('mongoose');

const PixelSchema = new mongoose.Schema({
    boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'PixelBoard', required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    color: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Pour gérer les délais entre actions
});

module.exports = mongoose.model('Pixel', PixelSchema);
