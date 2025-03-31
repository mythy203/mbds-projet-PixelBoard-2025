import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { enums } from "../Enums/enums.js";
import FlashMessage from "react-flash-message";
import { createRoot } from "react-dom/client";
import styles from "../styles/PixelCanvas.module.css";

const PixelCanvas = forwardRef(
  ({ pixelBoard, onPixelColorChange, user, selectedColor, onPixelPlaced, pixelDelay }, ref) => {
    const [pixels, setPixels] = useState([]);
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredPixel, setHoveredPixel] = useState(null);
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverAnimationRef = useRef(null);
    const webSocketRef = useRef(null);

    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const isClickRef = useRef(true);
    const clickTimerRef = useRef(null);

    useImperativeHandle(ref, () => ({
      resetView() {
        centerCanvas();
      },
    }));

    // WebSocket
    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:3000/ws/pixels/${pixelBoard._id}`);

      ws.onopen = () => console.log("WebSocket connecté");

      ws.onmessage = (event) => {
        try {
          const { data: pixelUpdate } = JSON.parse(event.data);
          setPixels((prev) => {
            const existing = prev.findIndex((p) => p.x === pixelUpdate.x && p.y === pixelUpdate.y);
            if (existing >= 0) {
              const newPixels = [...prev];
              newPixels[existing] = { ...newPixels[existing], color: pixelUpdate.color };
              return newPixels;
            } else {
              return [...prev, pixelUpdate];
            }
          });
        } catch (error) {
          console.error("Erreur WS :", error);
        }
      };

      webSocketRef.current = ws;
      return () => ws.close();
    }, [pixelBoard._id]);

    const hexToRgba = (hex, alpha = 1) => {
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    const centerCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const wrapper = canvas.parentElement;
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      const grid = pixelBoard.size;
      const pixelSize = Math.min(w, h) / grid;

      setOffset({ x: (w - grid * pixelSize) / 2, y: (h - grid * pixelSize) / 2 });
      setScale(1);
    };

    const animateHover = (target) => {
      if (hoverAnimationRef.current) cancelAnimationFrame(hoverAnimationRef.current);

      const step = () => {
        setHoverOpacity((prev) => {
          const diff = target - prev;
          if (Math.abs(diff) < 0.05) return target;
          return prev + diff * 0.01;
        });
        hoverAnimationRef.current = requestAnimationFrame(step);
      };
      hoverAnimationRef.current = requestAnimationFrame(step);
    };

    const drawBoard = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      const wrapper = canvas.parentElement;
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;

      canvas.width = w;
      canvas.height = h;

      ctx.clearRect(0, 0, w, h);
      ctx.save();
      ctx.translate(offset.x, offset.y);
      ctx.scale(scale, scale);

      const grid = pixelBoard.size;
      const pixelSize = Math.min(w, h) / grid;

      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, grid * pixelSize, grid * pixelSize);

      pixels.forEach(({ x, y, color }) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
      });

      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      for (let i = 0; i <= grid; i++) {
        ctx.beginPath();
        ctx.moveTo(i * pixelSize, 0);
        ctx.lineTo(i * pixelSize, grid * pixelSize);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * pixelSize);
        ctx.lineTo(grid * pixelSize, i * pixelSize);
        ctx.stroke();
      }

      if (hoveredPixel) {
        ctx.save();
        const padding = pixelSize * 0.15;
        const rgba = hexToRgba(selectedColor, hoverOpacity * 0.7);
        ctx.fillStyle = rgba;
        ctx.shadowColor = selectedColor;
        ctx.shadowBlur = 8;

        ctx.fillRect(
          hoveredPixel.x * pixelSize - padding,
          hoveredPixel.y * pixelSize - padding,
          pixelSize + 2 * padding,
          pixelSize + 2 * padding
        );

        ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          hoveredPixel.x * pixelSize,
          hoveredPixel.y * pixelSize,
          pixelSize,
          pixelSize
        );

        ctx.restore();
      }

      ctx.restore();
    };

    useEffect(() => {
      drawBoard();
    }, [scale, offset, pixelBoard, pixels, hoveredPixel, hoverOpacity]);

    useEffect(() => {
      const canvas = canvasRef.current;
      const wheel = (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const beforeX = (mouseX - offset.x) / scale;
        const beforeY = (mouseY - offset.y) / scale;

        const delta = e.deltaY < 0 ? 0.1 : -0.1;
        const newScale = Math.max(scale + delta, 0.1);
        const afterX = beforeX * newScale;
        const afterY = beforeY * newScale;

        setScale(newScale);
        setOffset({ x: mouseX - afterX, y: mouseY - afterY });
      };

      canvas.addEventListener("wheel", wheel, { passive: false });
      return () => canvas.removeEventListener("wheel", wheel);
    }, [scale, offset]);

    const handleMouseDown = (e) => {
      isClickRef.current = true;
      isDraggingRef.current = false;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
      clickTimerRef.current = setTimeout(() => {
        isClickRef.current = false;
      }, 150);
    };

    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const grid = pixelBoard.size;
      const size = Math.min(canvas.width, canvas.height);
      const pixelSize = size / grid;

      if (e.buttons === 1) {
        const dx = e.clientX - lastMousePosRef.current.x;
        const dy = e.clientY - lastMousePosRef.current.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
          isClickRef.current = false;
          isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
          lastMousePosRef.current = { x: e.clientX, y: e.clientY };
          setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
          setHoveredPixel(null);
          animateHover(0);
        }
      } else {
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const tx = (mouseX - offset.x) / scale;
        const ty = (mouseY - offset.y) / scale;
        const px = Math.floor(tx / pixelSize);
        const py = Math.floor(ty / pixelSize);

        if (px >= 0 && px < grid && py >= 0 && py < grid) {
          setHoveredPixel({ x: px, y: py });
          animateHover(1);
        } else {
          setHoveredPixel(null);
          animateHover(0);
        }
      }

      drawBoard();
    };

    const handleMouseUp = async (e) => {
      if (!isClickRef.current) return;

      if (pixelDelay > 0) {
        const flash = document.getElementById("flash-message");
        createRoot(flash).render(
          <FlashMessage duration={3000}>
            <p>Veuillez attendre {pixelDelay}s avant de dessiner à nouveau.</p>
          </FlashMessage>
        );
        return;
      }

      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const grid = pixelBoard.size;
      const size = Math.min(canvas.width, canvas.height);
      const pixelSize = size / grid;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const tx = (mouseX - offset.x) / scale;
      const ty = (mouseY - offset.y) / scale;
      const px = Math.floor(tx / pixelSize);
      const py = Math.floor(ty / pixelSize);

      if (px >= 0 && px < grid && py >= 0 && py < grid) {
        const pixelData = {
          boardId: pixelBoard._id,
          x: px,
          y: py,
          color: selectedColor,
          userId: user?._id,
        };

        const flash = document.getElementById("flash-message");
        const root = createRoot(flash);

        const existing = pixels.find((p) => p.x === px && p.y === py);
        if (existing && !pixelBoard.mode) {
          root.render(<FlashMessage duration={3000}><p>Pixel déjà dessiné ici.</p></FlashMessage>);
          return;
        }

        try {
          const res = await axios.post("http://localhost:8000/api/pixels", pixelData);

          if (res.data.error === enums.PixelStatus.DELAY_NOT_RESPECTED) {
            root.render(<FlashMessage duration={3000}><p>{res.data.message}</p></FlashMessage>);
            return;
          }

          if (webSocketRef.current?.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify({ data: pixelData }));
          }

          const updated = await axios.get(`http://localhost:8000/api/pixels/${pixelBoard._id}`);
          setPixels(updated.data);

          if (onPixelPlaced) onPixelPlaced();

        } catch (err) {
          root.render(<FlashMessage duration={3000}><p>Erreur lors de l'envoi du pixel.</p></FlashMessage>);
        }
      }

      isDraggingRef.current = false;
    };

    const handleMouseLeave = () => {
      clearTimeout(clickTimerRef.current);
      isDraggingRef.current = false;
      setHoveredPixel(null);
      animateHover(0);
    };

    useEffect(() => {
      centerCanvas();
    }, [pixelBoard]);

    useEffect(() => {
      axios.get(`http://localhost:8000/api/pixels/${pixelBoard._id}`).then((res) => {
        setPixels(res.data);
      });
    }, [pixelBoard._id]);

    return (
      <div className={styles.canvasContainer}>
        <div id="flash-message" className={styles.flashMessage}></div>
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        />
      </div>
    );
  }
);

export default PixelCanvas;
