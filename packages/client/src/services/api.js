import axios from "axios";

const API_URL = "http://localhost:8000/api";

// 🔥 Requête GET pour récupérer le nombre de PixelBoards
export const getPixelBoardsCount = async () => {
    try {
        const response = await axios.get(`${API_URL}/pixelboards`);
        return response.data.length;  // On renvoie le nombre total
    } catch (error) {
        console.error("Erreur lors de la récupération des PixelBoards :", error);
        return 0;
    }
};
