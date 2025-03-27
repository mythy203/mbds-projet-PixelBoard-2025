import React, { useState } from "react";
import styles from "../styles/CreatePixelBoardForm.module.css";
import axios from "axios";

const CreatePixelBoardForm = ({ onCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    size: 10,
    mode: true,
    delayBetweenPixels: 10,
    endTime: "",
  });

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!formData.endTime) {
      alert("La date de fin est obligatoire.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/pixelboards", formData, {
        withCredentials: true,
      });
      onCreated();
    } catch (err) {
      console.error("Erreur lors de la création :", err);
    }
  };

  // Génère la date/heure actuelle au format compatible avec datetime-local
  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16); // format 'YYYY-MM-DDTHH:mm'
  };

  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Créer un PixelBoard</h3>
        <form onSubmit={handleCreateBoard} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Titre</label>
            <input
              type="text"
              placeholder="Titre du board"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Taille de la grille (ex: 10 pour 10x10)</label>
            <input
              type="number"
              min="1"
              placeholder="10"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: Number(e.target.value) })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Délai entre pixels (en secondes)</label>
            <input
              type="number"
              min="1"
              placeholder="10"
              value={formData.delayBetweenPixels}
              onChange={(e) =>
                setFormData({ ...formData, delayBetweenPixels: Number(e.target.value) })
              }
              required
            />
          </div>

          <div className={styles.formGroupCheckbox}>
            <label>
              <input
                type="checkbox"
                checked={formData.mode}
                onChange={(e) => setFormData({ ...formData, mode: e.target.checked })}
              />
              Autoriser le dessin sur un pixel existant
            </label>
          </div>

          <div className={styles.formGroup}>
            <label>Date et heure de fin</label>
            <input
              type="datetime-local"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              min={getMinDateTime()}
              required
            />
          </div>

          <div className={styles.formButtons}>
            <button type="submit" className={styles.submitButton}>
              Créer
            </button>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePixelBoardForm;
