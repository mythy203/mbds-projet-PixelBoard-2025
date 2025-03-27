import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/Header.module.css";
import { ThemeContext } from "../context/ThemeContext";

const Header = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <header className={`${styles.toolbar} toolbar`}>
      <div className={`${styles.logo} logo`} onClick={() => navigate("/")}>
        PixelBoard
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`${styles.toggle} toggle`}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div className={`${styles.userArea} userArea`}>
        

        {user ? (
          <>
            <span className={`${styles.username} username`}>
              👤{user.username}
              <span className={`${styles.role} role`}> ({user.role})</span>
            </span>
            <button
              onClick={onLogout}
              className={`${styles.button} button`}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={`${styles.button} button`}
          >
            Se connecter
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
