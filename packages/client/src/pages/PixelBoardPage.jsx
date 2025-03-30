import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import PixelCanvas from "../components/PixelCanvas";
import ResetViewButton from "../components/ResetViewButton";
import Header from "../components/Header";
import { getUserInfo } from "../services/api.js";
import styles from "../styles/PixelBoardPage.module.css";

const PixelBoardPage = () => {
  const { id } = useParams();
  const [pixelBoard, setPixelBoard] = useState(null);
  const [pixels, setPixels] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [selectedColor, setSelectedColor] = useState("#FF5733");
  const canvasRef = useRef();
  const navigate = useNavigate();
  const selectedColorRef = useRef(selectedColor);


  const colors = [
    "#FF5733", "#33FF57", "#3357FF",
    "#FFFF33", "#FF33FF", "#33FFFF",
    "#000000", "#FFFFFF"
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardRes, pixelsRes, userInfo] = await Promise.all([
          axios.get(`http://localhost:8000/api/pixelboards/${id}`),
          axios.get(`http://localhost:8000/api/pixels/${id}`),
          getUserInfo()
        ]);
        setPixelBoard(boardRes.data);
        setPixels(pixelsRes.data);
        setUser(userInfo);
      } catch (err) {
        setError("Erreur lors du chargement du PixelBoard.");
      }
    };
    fetchData();
  }, [id]);
  

  const handleResetView = () => {
    if (canvasRef.current) canvasRef.current.resetView();
  };

  if (error) return <p>{error}</p>;
  if (!pixelBoard) return <p>Chargement...</p>;

  return (
    <div className={styles.pixelPage}>
      <Header user={user} onLogout={() => navigate("/")} />

      <div className={styles.boardBody}>
        <div className={styles.canvasWrapper}>
          <PixelCanvas
            ref={canvasRef}
            pixelBoard={pixelBoard}
            user={user}
            selectedColor={selectedColor}
            onPixelColorChange={(updatedBoard) => setPixelBoard(updatedBoard)}
          />
        </div>

        <div className={styles.sidebar}>
        <div className={styles.boardTitle}>{pixelBoard.title}</div>

          <div className={styles.preview}>
            <img src={pixelBoard.preview} alt="Preview" style={{ width: "100%" }} />
          </div>

          <button className={styles.button} onClick={handleResetView}>
            Recentrer
          </button>

          <a
            href={`http://localhost:8000/api/pixelboards/${pixelBoard._id}/export`}
            className={styles.button}
            download
          >
            📥 Export PNG
          </a>

          <div className={styles.palette}>
            {colors.map(color => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  selectedColorRef.current = color;
                }}
                className={styles.colorButton}
                style={{
                  backgroundColor: color,
                  border: selectedColor === color ? "2px solid white" : "1px solid #333"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PixelBoardPage;
