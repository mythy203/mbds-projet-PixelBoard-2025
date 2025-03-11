import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreatePixelBoard = () => {
    const [title, setTitle] = useState("");
    const [size, setSize] = useState(10);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/pixelboards", { title, size });
            navigate("/"); // Redirection vers l'accueil après création
        } catch (error) {
            console.error("Erreur lors de la création du PixelBoard :", error);
        }
    };

    return (
        <div>
            <h2>Créer un PixelBoard</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Titre :</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Taille :</label>
                    <input type="number" value={size} onChange={(e) => setSize(e.target.value)} required />
                </div>
                <button type="submit">Créer</button>
            </form>
        </div>
    );
};

export default CreatePixelBoard;
