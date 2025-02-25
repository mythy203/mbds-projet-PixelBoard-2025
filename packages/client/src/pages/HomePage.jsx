import React, { useEffect, useState } from "react";
import { getPixelBoardsCount } from "../services/api";

const HomePage = () => {
    const [count, setCount] = useState(0);

    // Appel API pour récupérer le nombre de PixelBoards
    useEffect(() => {
        const fetchData = async () => {
            const total = await getPixelBoardsCount();
            setCount(total);
        };
        fetchData();
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bienvenue sur PixelBoard</h1>
                <p>Nombre total de PixelBoards : <strong>{count}</strong></p>
            </header>
        </div>
    );
};

export default HomePage;
