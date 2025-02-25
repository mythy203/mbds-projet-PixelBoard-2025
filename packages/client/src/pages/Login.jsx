import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {  // Supprimé ": React.FormEvent"
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/auth/login", {
                email,
                password,
            });

            //  Vérifie si le token est bien reçu avant de l'enregistrer
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                navigate("/dashboard"); //  Redirige vers le dashboard
            } else {
                setError("Réponse invalide du serveur.");
            }
        } catch (err) {
            console.error("Erreur lors de la connexion:", err);
            setError("Email ou mot de passe incorrect.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Connexion</h2>
                
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                    required
                />

                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                    required
                />

                <button 
                    type="submit" 
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold p-2 w-full rounded">
                    Se connecter
                </button>

                <p className="mt-4 text-center text-sm">
                    Pas encore inscrit ? <a href="/register" className="text-blue-500 hover:underline">Créer un compte</a>
                </p>
            </form>
        </div>
    );
};

export default Login;
