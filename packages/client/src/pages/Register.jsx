import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {  
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:4000/api/auth/register", {
                name,
                email,
                password,
            });

            //  Vérifie si l'inscription a réussi avant de rediriger
            if (response.status === 201) {
                navigate("/login"); //  Redirige vers la page de connexion
            } else {
                setError("Une erreur est survenue.");
            }
        } catch (err) {
            console.error("Erreur lors de l'inscription:", err);
            setError("Erreur lors de l'inscription. Vérifiez vos informations.");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <form onSubmit={handleRegister} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Inscription</h2>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <input
                    type="text"
                    placeholder="Nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full mb-4 rounded"
                    required
                />

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
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold p-2 w-full rounded">
                    S'inscrire
                </button>

                <p className="mt-4 text-center text-sm">
                    Déjà inscrit ? <a href="/login" className="text-blue-500 hover:underline">Se connecter</a>
                </p>
            </form>
        </div>
    );
};

export default Register;
