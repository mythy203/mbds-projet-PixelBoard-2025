const jwt = require('jsonwebtoken');
const User = require('../models/users'); // Assure-toi d'importer le modèle User
const secret = 'your_jwt_secret';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.userId = user._id;
        req.userRole = user.role; // Ajout du rôle
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
