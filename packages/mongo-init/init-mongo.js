print(" Initialisation de MongoDB avec des données de test...");

db = db.getSiblingDB("pixelboard");

let user = db.users.findOne({ username: "admin" });

if (!user) {
  const userId = ObjectId();
  user = {
    _id: userId,
    username: "admin",
    password: "123456", 
    role: "admin"
  };
  db.users.insertOne(user);
  print(" Utilisateur admin créé avec ID:", userId);
} else {
  print(" Utilisateur admin déjà existant avec ID:", user._id);
}


const boardId = ObjectId();

db.pixelboards.insertOne({
  _id: boardId,
  title: "Pixel War 2025",
  status: "en cours",
  createdAt: new Date(),
  endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  size: 10,
  mode: true, 
  delayBetweenPixels: 10,
  createdBy: user._id,
  preview: null
});

print(" PixelBoard créé avec ID:", boardId);


const pixels = [];
const white = "#FFFFFF"; 

for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 10; y++) {
    pixels.push({
      boardId: boardId,
      x: x,
      y: y,
      color: white,
      createdAt: new Date()
    });
  }
}
db.pixels.insertMany(pixels);

print("Pixels blancs ajoutés !");
print("MongoDB est prêt avec un PixelBoard vide !");
