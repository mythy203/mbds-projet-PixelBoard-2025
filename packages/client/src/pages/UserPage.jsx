import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import styles from "../styles/UserPage.module.css";
import { getUserInfo } from "../services/api";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      if (!userInfo) {
        navigate("/login");
      } else {
        setUser(userInfo);
        fetchContributions(userInfo._id);
      }
    };

    fetchData();
  }, [navigate]);

  const fetchContributions = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/pixels/user/${userId}`);
      setContributions(response.data.contributions);
      setTotal(response.data.total);
    } catch (error) {
      console.error("Erreur lors du chargement des contributions :", error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Erreur de déconnexion :", err);
    }
  };

  return (
    <>
      <Header user={user} onLogout={handleLogout} />

      <div className={styles.page}>
        <main className={styles.content}>
          <div className={styles.welcomeCard}>
            <h2>👤 Bonjour {user?.username}</h2>
            <p>Bienvenue sur votre espace personnel PixelBoard.</p>
          </div>

          <section className={styles.section}>
            <h3>📊 Vos contributions</h3>
            <div className={styles.stats}>
              <p>Total de pixels ajoutés : <strong>{total}</strong></p>
            </div>

            {contributions.length > 0 ? (
              <div className={styles.cardsGrid}>
                {contributions.map((c, index) => (
                  <div key={index} className={styles.contributionCard}>
                    <div className={styles.cardHeader}>
                      <h4 className={styles.boardTitle}>{c.board?.title || c.board}</h4>
                      <span className={styles.pixelBadge}>
                        {c.count} pixel{c.count > 1 ? "s" : ""}
                      </span>
                    </div>
                    {c.board?._id && (
                      <button
                        className={styles.viewButton}
                        onClick={() => navigate(`/pixelboard/${c.board._id}`)}
                      >
                        Voir le PixelBoard
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>Vous n'avez encore ajouté aucun pixel.</p>
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default UserPage;
