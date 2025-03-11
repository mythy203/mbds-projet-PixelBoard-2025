import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getPixelBoardsCount, getUserInfo } from "../services/api";
import axios from "axios";

const HomePage = () => {
    const [count, setCount] = useState(0);
    const [user, setUser] = useState(null);

    // Appel API pour récupérer le nombre de PixelBoards et les informations de l'utilisateur
    useEffect(() => {
        const fetchData = async () => {
            const total = await getPixelBoardsCount();
            setCount(total);

            const userInfo = await getUserInfo();
            setUser(userInfo);
        };
        fetchData();
    }, []);

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/auth/logout');
            navigate('/login');
        } catch (err) {
            console.error('Error logging out', err);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Bienvenue sur PixelBoard</h1>
                {user && <p>Connecté en tant que : <strong>{user.username}</strong></p>}
                <p>Nombre total de PixelBoards : <strong>{count}</strong></p>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
                <button onClick={handleLogout}>Logout</button>
            </header>
        </div>
    );
};

export default HomePage;