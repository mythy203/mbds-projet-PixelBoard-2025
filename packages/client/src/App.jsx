import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import logo from "./logo.svg";
import "./App.css";

const { VITE_API_URL } = import.meta.env;

function App() {
    const [resp, setResp] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    const handleClickTest = async () => {
        console.log("VITE_API_URL", VITE_API_URL);
        setError(null);
        setResp(null);
        setLoading(true);

        await fetch(VITE_API_URL)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setResp(data);
            })
            .catch((err) => {
                console.error("Erreur API :", err);
                setError(err.message); //  Correction de `setError(error)`
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>Project MBDS 2025 - SKELETON</p>
                    <br />
                    <button type="button" onClick={handleClickTest}>Call API for test</button>
                    {loading && <p>Loading...</p>}
                    {resp && <p>Response: {JSON.stringify(resp)}</p>}
                    {error && <p>Error: {error}</p>}
                </header>

                {/*  Ajout des Routes */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Login />} /> {/* Redirection des URL inconnues */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;
