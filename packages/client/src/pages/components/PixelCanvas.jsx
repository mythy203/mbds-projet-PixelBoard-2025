// filepath: c:\Users\test\Documents\GitHub\mbds-projet-PixelBoard-2025\packages\client\src\components\PixelCanvas.jsx
import React, { useRef, useEffect, useState } from "react";

const PixelCanvas = ({ pixelBoard, pixels }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredPixel, setHoveredPixel] = useState(null);

  // Références pour la gestion du panning
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Fonction de dessin du board sur le canvas
  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    // Le canvas occupe toute la fenêtre
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    // Appliquer le panning et le zoom
    ctx.translate(offset.x, offset.y);
    ctx.scale(scale, scale);

    const gridSize = pixelBoard.size;
    // On utilise la dimension minimale pour conserver un rendu carré
    const boardDimension = Math.min(window.innerWidth, window.innerHeight);
    const pixelSize = boardDimension / gridSize;

    // Dessiner le fond (blanc)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, gridSize * pixelSize, gridSize * pixelSize);

    // Dessiner les pixels existants (modifiés via API)
    pixels.forEach(({ x, y, color }) => {
      ctx.fillStyle = color || "#fff";
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    });

    // Dessiner la grille
    ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      // Lignes verticales
      ctx.beginPath();
      ctx.moveTo(i * pixelSize, 0);
      ctx.lineTo(i * pixelSize, gridSize * pixelSize);
      ctx.stroke();
      // Lignes horizontales
      ctx.beginPath();
      ctx.moveTo(0, i * pixelSize);
      ctx.lineTo(gridSize * pixelSize, i * pixelSize);
      ctx.stroke();
    }

    // Si un pixel est survolé, ajouter l'effet hover
    if (hoveredPixel) {
      ctx.save();
      // On ajoute une animation d'agrandissement léger via un padding
      const hoverPadding = pixelSize * 0.1; // 10% de padding
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.fillRect(
        hoveredPixel.x * pixelSize - hoverPadding,
        hoveredPixel.y * pixelSize - hoverPadding,
        pixelSize + 2 * hoverPadding,
        pixelSize + 2 * hoverPadding
      );
      ctx.strokeRect(
        hoveredPixel.x * pixelSize - hoverPadding,
        hoveredPixel.y * pixelSize - hoverPadding,
        pixelSize + 2 * hoverPadding,
        pixelSize + 2 * hoverPadding
      );
      ctx.restore();
    }
    ctx.restore();
  };

  // Redessiner lorsque les dépendances changent
  useEffect(() => {
    drawBoard();
  }, [scale, offset, pixelBoard, pixels, hoveredPixel]);

  // Gestion du zoom avec la molette (en empêchant le scroll de la page)
  useEffect(() => {
    const canvas = canvasRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      const scaleAmount = 0.1;
      const newScale = e.deltaY < 0 ? scale + scaleAmount : scale - scaleAmount;
      setScale(Math.max(newScale, 0.1));
    };
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [scale]);

  // Gestion du panning et de l'effet hover
  const handleMouseDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    // Lorsque le dragging commence, on efface l'effet hover
    setHoveredPixel(null);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Si on est en mode drag, mettre à jour l'offset
    if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));
      // On efface l'hover pendant le drag
      setHoveredPixel(null);
    } else {
      // Calculer la position relative au canvas
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const gridSize = pixelBoard.size;
      const boardDimension = Math.min(canvas.width, canvas.height);
      const pixelSize = boardDimension / gridSize;
      // Inverser la transformation appliquée (panning et zoom)
      const transformedX = (mouseX - offset.x) / scale;
      const transformedY = (mouseY - offset.y) / scale;
      const pixelX = Math.floor(transformedX / pixelSize);
      const pixelY = Math.floor(transformedY / pixelSize);
      if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
        setHoveredPixel({ x: pixelX, y: pixelY });
      } else {
        setHoveredPixel(null);
      }
    }
    drawBoard();
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseLeave = () => {
    isDraggingRef.current = false;
    setHoveredPixel(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    />
  );
};

export default PixelCanvas;
