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
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setUploadedImage(file);
    };
    reader.readAsDataURL(file);
  };

  const processImageToPixels = async (pixelBoardId, size) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        // Créer un canvas temporaire pour traiter l'image
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = size;
        tempCanvas.height = size;
        const ctx = tempCanvas.getContext('2d');
        
        // Redimensionner l'image à la taille du pixelboard
        ctx.drawImage(img, 0, 0, size, size);
        
        // Extraire les données de pixels
        const imageData = ctx.getImageData(0, 0, size, size).data;
        
        try {
          // Traiter les pixels par lots
          const batchSize = 25;
          const totalPixels = size * size;
          const batches = Math.ceil(totalPixels / batchSize);
          
          for (let batch = 0; batch < batches; batch++) {
            const startIdx = batch * batchSize;
            const endIdx = Math.min(startIdx + batchSize, totalPixels);
            const pixelBatch = [];
            
            for (let i = startIdx; i < endIdx; i++) {
              const y = Math.floor(i / size);
              const x = i % size;
              const pixelPos = (y * size + x) * 4;
              
              // Vérifier que le pixel n'est pas transparent
              const alpha = imageData[pixelPos + 3];
              if (alpha < 128) continue;  // Ignorer les pixels transparents
              
              const r = imageData[pixelPos];
              const g = imageData[pixelPos + 1];
              const b = imageData[pixelPos + 2];
              
              // Convertir RGB en hexadécimal
              const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
              
              pixelBatch.push({
                boardId: pixelBoardId,
                x,
                y,
                color: hexColor
              });
            }
            
            // Envoyer le lot au serveur
            if (pixelBatch.length > 0) {
              await axios.post("http://localhost:8000/api/pixels/batch", { pixels: pixelBatch }, {
                withCredentials: true,
              });
            }
            
            // Petite pause pour éviter de surcharger le serveur
            await new Promise(r => setTimeout(r, 100));
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error("Erreur lors du chargement de l'image"));
      img.src = imagePreview;
    });
  };

  const handleCreateBoard = async (e) => {
    e.preventDefault();

    if (!formData.endTime) {
      alert("La date de fin est obligatoire.");
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Créer le pixelboard d'abord
      const response = await axios.post("http://localhost:8000/api/pixelboards", formData, {
        withCredentials: true,
      });
      
      // 2. Si une image a été uploadée, la convertir en pixels
      if (uploadedImage && imagePreview) {
        try {
          await processImageToPixels(response.data._id, formData.size);
        } catch (imgError) {
          console.error("Erreur lors du traitement de l'image :", imgError);
          // Le pixelboard est créé mais l'image n'a pas pu être traitée
          alert("Le pixelboard a été créé mais l'image n'a pas pu être convertie en pixels.");
        }
      }
      
      setIsLoading(false);
      onCreated();
    } catch (err) {
      setIsLoading(false);
      console.error("Erreur lors de la création :", err);
      alert("Erreur lors de la création du pixelboard.");
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
              max="100"
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
          
          {/* Champ pour upload d'image */}
          <div className={styles.formGroup}>
            <label>Image à convertir en pixels (optionnel)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className={styles.fileInput}
            />
            {uploadedImage && (
              <button 
                type="button" 
                className={styles.removeButton}
                onClick={() => {
                  setImagePreview(null);
                  setUploadedImage(null);
                }}
              >
                Supprimer l'image
              </button>
            )}
          </div>

          <div className={styles.formButtons}>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Création en cours..." : "Créer"}
            </button>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onCancel}
              disabled={isLoading}
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePixelBoardForm;