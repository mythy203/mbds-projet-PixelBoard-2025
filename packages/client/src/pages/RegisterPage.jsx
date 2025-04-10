import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../styles/RegisterPage.module.css";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:8000/api/auth/signup", {
        username,
        password,
        role,
      });

      if (res.data.message === "User created") {
        navigate("/login");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Nom déjà utilisé.");
      } else {
        setError("Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <div className={`${styles.page} ${theme === "dark" ? styles.dark : ""}`}>
      <video autoPlay muted loop className={styles.videoBg}>
        <source src="/background-signup-login.mp4" type="video/mp4" />
      </video>

      <div className={styles.container}>
        <h2 className={styles.title}>Créer un compte</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nom"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />

          <div className={styles["role-group"]}>
            <div className={styles["role-title"]}>Sélection d’un rôle</div>
            <div className={styles["role-options"]}>
              <label className={styles["role-label"]}>
                <input
                  type="radio"
                  value="user"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                  className={styles["role-radio"]}
                />
                Utilisateur
              </label>
              <label className={styles["role-label"]}>
                <input
                  type="radio"
                  value="admin"
                  checked={role === "admin"}
                  onChange={() => setRole("admin")}
                  className={styles["role-radio"]}
                />
                Administrateur
              </label>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Créer un compte
          </button>

          <p className={styles.switch}>
            Déjà inscrit ?{" "}
            <a href="/login" className={styles.link}>
              Se connecter
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
