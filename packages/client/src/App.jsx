// filepath: c:\Users\test\Documents\GitHub\mbds-projet-PixelBoard-2025\packages\client\src\App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import PixelBoardPage from './pages/PixelBoardPage.jsx';

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/pixelboard/:id" element={<PixelBoardPage />} />
      </Routes>
    </Router>
  );
}

export default App;