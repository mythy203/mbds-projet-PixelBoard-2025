const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/pixelboard", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log(`MongoDB connecté : ${conn.connection.host}`);
    } catch (error) {
        console.error(" Erreur MongoDB :", error);
        process.exit(1);
    }
};

module.exports = connectDB;
