import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PixelBoardPage from './pages/PixelBoardPage.jsx';
import AdminPage from './pages/AdminPage.jsx';
import UserPage from './pages/UserPage.jsx'; // ✅ Ajout de la page user
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pixelboard/:id" element={<PixelBoardPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} /> {/* ✅ Page utilisateur */}
      </Routes>
    </Router>
  );
}

export default App;
