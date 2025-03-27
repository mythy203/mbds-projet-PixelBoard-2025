import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/HomePage.module.css";
import Header from "../components/Header";
import { getUserInfo } from "../services/api";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [pixelBoards, setPixelBoards] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);

      const response = await axios.get("http://localhost:8000/api/pixelboards");
      setPixelBoards(response.data);
    };
    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, {
        withCredentials: true,
      });
      setUser(null);
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  const boardsEnCours = pixelBoards.filter(b => b.status === "en cours");
  const boardsTermines = pixelBoards.filter(b => b.status === "terminée");

  return (
    <div className={styles.page}>
      <Header user={user} onLogout={handleLogout} />

      <main className={styles.content}>
        <h2>Bienvenue sur PixelBoard </h2>
        <p className={styles.stats}>
          Nombre total de PixelBoards : <strong>{pixelBoards.length}</strong>
        </p>

        <section>
          <h3>🟢 En cours de création</h3>
          <ul className={styles.list}>
            {boardsEnCours.map(board => (
              <li key={board._id}>
                <Link to={`/pixelboard/${board._id}`}>{board.title}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3>🔒 PixelBoards terminés</h3>
          <ul className={styles.list}>
            {boardsTermines.map(board => (
              <li key={board._id}>
                <Link to={`/pixelboard/${board._id}`}>{board.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
