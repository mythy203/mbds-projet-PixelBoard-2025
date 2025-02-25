const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = express.Router();

// Simule une base de données (Remplace par MongoDB si nécessaire)
const users = [];

//  Route d'inscription
router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ name, email, password: hashedPassword });

    res.status(201).json({ message: "Utilisateur créé avec succès !" });
});

//  Route de connexion
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign({ email: user.email }, "SECRET_KEY", { expiresIn: "1h" });

    res.json({ token });
});

module.exports = router;
