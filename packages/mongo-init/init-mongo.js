print("🚀 Initialisation de MongoDB avec des données de test...");

// Connexion à la base de données `pixelboard`
db = db.getSiblingDB("pixelboard");

// Création de la collection `pixelboards` avec un exemple
const boardId = ObjectId();
db.pixelboards.insertOne({
    _id: boardId,
    title: "Pixel War2025",
    status: "en cours",
    createdAt: new Date(),
    endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 jours plus tard
    size: 10,
    mode: "restricted",
    delayBetweenActions: 10
});

// Création de la collection `pixels` avec des pixels d'exemple pour créer un motif en damier
const pixels = [];
const colors = ["#FF5733", "#33FF57", "#3357FF"];
for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
        const color = colors[(x + y) % colors.length];
        pixels.push({ boardId: boardId, x: x, y: y, color: color, createdAt: new Date() });
    }
}
db.pixels.insertMany(pixels);

print("✅ MongoDB est prêt avec des données de test !");