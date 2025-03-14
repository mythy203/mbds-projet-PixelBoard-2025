import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PixelCanvas from "./components/PixelCanvas";
import TitleOverlay from "./components/TitleOverlay";
import ResetViewButton from "./components/ResetViewButton";

const PixelBoardPage = () => {
  const { id } = useParams();
  const [pixelBoard, setPixelBoard] = useState(null);
  const [pixels, setPixels] = useState([]);
  const [error, setError] = useState("");
  const canvasRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardResponse, pixelsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/pixelboards/${id}`),
          axios.get(`http://localhost:8000/api/pixels/${id}`)
        ]);
        setPixelBoard(boardResponse.data);
        setPixels(pixelsResponse.data);
      } catch (err) {
        setError("Erreur lors du chargement du PixelBoard.");
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;
  if (!pixelBoard) return <p className="text-center mt-4">Chargement...</p>;

  const handleResetView = () => {
    if (canvasRef.current) {
      canvasRef.current.resetView();
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <TitleOverlay title={pixelBoard.title} />
      <ResetViewButton onReset={handleResetView} />

      <PixelCanvas ref={canvasRef} pixelBoard={pixelBoard} pixels={pixels} />
    </div>
  );
};

export default PixelBoardPage;
