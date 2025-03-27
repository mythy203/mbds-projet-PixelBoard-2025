import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/HomePage.module.css";
import Header from "../components/Header";
import { getUserInfo } from "../services/api";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [pixelBoards, setPixelBoards] = useState([]);

  const fetchBoards = async () => {
    const response = await axios.get("http://localhost:8000/api/pixelboards");
    setPixelBoards(response.data);
  };

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);
      await fetchBoards();
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  const boardsEnCours = pixelBoards.filter(b => b.status === "en cours");
  const boardsTermines = pixelBoards.filter(b => b.status === "terminée");

  const renderBoards = (boards) => (
    <div className={styles.grid}>
      {boards.map(board => (
        <div key={board._id} className={styles.card}>
          <Link to={`/pixelboard/${board._id}`} className={styles.cardContent}>
            <h4>{board.title}</h4>
            <p>Status : <strong>{board.status}</strong></p>
            <p>Dimensions : {board.size} x {board.size}</p>
          </Link>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.page}>
      <Header user={user} onLogout={handleLogout} />

      <main className={styles.content}>
        <h2 className={styles.title}>Bienvenue sur PixelBoard</h2>

        <p className={styles.stats}>
          Nombre total de PixelBoards : <strong>{pixelBoards.length}</strong>
        </p>

        <section className={styles.section}>
          <h3>🟢 En cours de création</h3>
          {boardsEnCours.length > 0 ? renderBoards(boardsEnCours) : <p>Aucun PixelBoard en cours.</p>}
        </section>

        <section className={styles.section}>
          <h3>🔒 PixelBoards terminés</h3>
          {boardsTermines.length > 0 ? renderBoards(boardsTermines) : <p>Aucun PixelBoard terminé.</p>}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
