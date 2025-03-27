import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:8000/api/auth/login',
        { username, password },
        { withCredentials: true }
      );
  
      if (response.data.message === 'Logged in') {
        const role = response.data.role;
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'user') {
          navigate('/user'); // ✅ redirection vers la page utilisateur
        } else {
          navigate('/'); // fallback
        }
      }
    } catch (err) {
      setError('Identifiants invalides');
    }
  };
  
  

  return (
    <div className={styles.page}>
      <video autoPlay muted loop className={styles.videoBg}>
        <source src="/background-signup-login.mp4" type="video/mp4" />
      </video>
      <div className={styles.container}>
        <h2 className={styles.title}>Se connecter</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            placeholder="Nom d'utilisateur"
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

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button}>
            Connexion
          </button>
          <p className={styles.switch}>
            Pas encore inscrit ?{" "}
            <a href="/register" className={styles.link}>
              Inscription
            </a>
          </p>


        </form>
      </div>
    </div>
  );
};

export default LoginPage;
