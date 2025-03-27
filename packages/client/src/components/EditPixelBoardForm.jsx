import React, { useState } from "react";
import axios from "axios";
import styles from "../styles/EditPixelBoardForm.module.css";

const EditPixelBoardForm = ({ board, onUpdated, onCancel }) => {
  const [title, setTitle] = useState(board.title);
  const [size, setSize] = useState(board.size);
  const [mode, setMode] = useState(board.mode);
  const [delayBetweenPixels, setDelay] = useState(board.delayBetweenPixels);
  const [endTime, setEndTime] = useState(board.endTime?.slice(0, 16) || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/api/pixelboards/${board._id}`, {
        title,
        size,
        mode,
        delayBetweenPixels,
        endTime,
      }, { withCredentials: true });

      onUpdated();
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3>Modifier le PixelBoard</h3>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Titre</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Taille</label>
          <input type="number" value={size} onChange={(e) => setSize(Number(e.target.value))} required />

          <label>
            <input type="checkbox" checked={mode} onChange={(e) => setMode(e.target.checked)} />
            Autoriser à dessiner sur des pixels existants
          </label>

          <label>Délai entre pixels (s)</label>
          <input type="number" value={delayBetweenPixels} onChange={(e) => setDelay(Number(e.target.value))} required />

          <label>Date de fin</label>
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />

          <div className={styles.buttons}>
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onCancel} className={styles.cancel}>Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPixelBoardForm;
