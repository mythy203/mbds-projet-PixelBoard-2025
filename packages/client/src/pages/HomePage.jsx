import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import styles from "../styles/HomePage.module.css";
import Header from "../components/Header";
import { getUserInfo } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [pixelBoards, setPixelBoards] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [visibleChars, setVisibleChars] = useState(0);

  const fullText = "Bienvenue sur ";
  const pixelText = "PixelBoard ";
  const combinedText = fullText + pixelText;

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);

      const boardsRes = await axios.get("http://localhost:8000/api/pixelboards");
      setPixelBoards(boardsRes.data);

      const usersRes = await axios.get("http://localhost:8000/api/users");
      const count = usersRes.data.filter(u => u.role === "user").length;
      setUserCount(count);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleChars(prev => {
        if (prev < combinedText.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const boardsEnCours = pixelBoards.filter(b => b.status === "en cours");
  const boardsTermines = pixelBoards.filter(b => b.status === "terminée");

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [{ breakpoint: 768, settings: { slidesToShow: 1 } }]
  };

  return (
    <div className={styles.page}>
      <Header user={user} onLogout={() => setUser(null)} />

      {/* Hero */}
      <section className={styles.hero}>
        <video className={styles.video} autoPlay muted loop playsInline>
          <source src="/chill-mario-pixel-moewalls-com.mp4" type="video/mp4" />
        </video>
        <div className={styles.overlay}>
          <h1 className={styles.typingLine}>
            {combinedText.slice(0, visibleChars).split("").map((char, i) => (
              <span key={i} className={i >= fullText.length ? styles.logoFont : ""}>
                {char}
              </span>
            ))}
          </h1>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statLabel}>Utilisateurs inscrits</div>
          <div className={styles.statNumber}>{userCount}</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🧩</div>
          <div className={styles.statLabel}>PixelBoards créés</div>
          <div className={styles.statNumber}>{pixelBoards.length}</div>
        </div>
      </section>

      {/* Carousels */}
      <section className={styles.boardsSection}>
        <div className={styles.carouselBlock}>
          <h3>
            <img src="mario-luigi.gif" alt="En cours" className={styles.icon} />
            En cours
          </h3>
          {boardsEnCours.length > 0 ? (
            <Slider {...sliderSettings}>
              {boardsEnCours.map(board => (
                <div key={board._id} className={styles.slide}>
                  <div className={styles.card}>
                    <Link to={`/pixelboard/${board._id}`} className={styles.cardContent}>
                      <h4>{board.title}</h4>
                      <p>Status : <strong>{board.status}</strong></p>
                      <p>Taille : {board.size} x {board.size}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          ) : <p>Aucun PixelBoard en cours.</p>}
        </div>

        <div className={styles.carouselBlock}>
          <h3>
            <img src="mario-dancing.gif" alt="Terminée" className={styles.icon} />
            Terminée
          </h3>          {boardsTermines.length > 0 ? (
            <Slider {...sliderSettings}>
              {boardsTermines.map(board => (
                <div key={board._id} className={styles.slide}>
                  <div className={styles.card}>
                    <Link to={`/pixelboard/${board._id}`} className={styles.cardContent}>
                      <h4>{board.title}</h4>
                      <p>Status : <strong>{board.status}</strong></p>
                      <p>Taille : {board.size} x {board.size}</p>
                    </Link>
                  </div>
                </div>
              ))}
            </Slider>
          ) : <p>Aucun PixelBoard terminé.</p>}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
