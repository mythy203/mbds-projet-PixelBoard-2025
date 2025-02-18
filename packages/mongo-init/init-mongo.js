print("🚀 Initialisation de MongoDB avec des données de test...");

// Connexion à la base de données `pixelboard`
db = db.getSiblingDB("pixelboard");

// Création de la collection `pixelboards` avec un exemple
db.pixelboards.insertOne({
    title: "Pixel War",
    status: "en cours",
    createdAt: new Date(),
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours plus tard
    size: 100,
    mode: "restricted",
    delayBetweenActions: 10
});

// Création de la collection `pixels` avec des pixels d'exemple
db.pixels.insertMany([
    { boardId: ObjectId(), x: 10, y: 20, color: "#FF5733", createdAt: new Date() },
    { boardId: ObjectId(), x: 30, y: 40, color: "#33FF57", createdAt: new Date() },
    { boardId: ObjectId(), x: 50, y: 60, color: "#3357FF", createdAt: new Date() }
]);

print("✅ MongoDB est prêt avec des données de test !");
