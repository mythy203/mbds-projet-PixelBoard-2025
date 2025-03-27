import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PixelBoardPage from './pages/PixelBoardPage.jsx';
import CreatePixelBoardForm from './components/CreatePixelBoardForm.jsx';
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pixelboard/:id" element={<PixelBoardPage />} />
        <Route path="/create-pixelboard" element={<CreatePixelBoardForm />} /> {/* 🔥 Nouvelle route */}
      </Routes>
    </Router>
  );
}

export default App;
