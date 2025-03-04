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

// Requête GET pour récupérer les informations de l'utilisateur connecté
export const getUserInfo = async () => {
    try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        return response.data;
    } catch (error) {
        console.error("Erreur lors de la récupération des informations de l'utilisateur :", error);
        return null;
    }
};