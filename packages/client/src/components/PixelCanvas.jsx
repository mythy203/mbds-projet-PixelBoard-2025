import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { enums } from "../Enums/enums.js";
import FlashMessage from "react-flash-message";
import { createRoot } from "react-dom/client";
import styles from "../styles/PixelCanvas.module.css";

  const PixelCanvas = forwardRef(({ pixelBoard, onPixelColorChange, user,selectedColor}, ref) => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFFF33", "#FF33FF", "#33FFFF", "#000000", "#FFFFFF"];
	  const [pixels, setPixels] = useState([]);
    const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredPixel, setHoveredPixel] = useState(null);
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverAnimationRef = useRef(null);
	  const webSocketRef = useRef(null);

    // Références pour le panning
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });
    const isClickRef = useRef(true);
    const clickTimerRef = useRef(null);

    // Exposer la méthode resetView au parent
    useImperativeHandle(ref, () => ({
        resetView() {
            centerCanvas();
        }
    }));

	// Configuration et connexion WebSocket
	useEffect(() => {
		const wsUrl = `ws://localhost:3000/ws/pixels/${pixelBoard._id}`;

		const ws = new WebSocket(wsUrl);

		ws.onopen = () => {
			console.log('WebSocket connecté');
		};

		ws.onmessage = (event) => {
			try {
				const message = JSON.parse(event.data);
				const pixelUpdate = message.data;

						setPixels(prevPixels => {
							const newPixels = [...prevPixels];
							const existingPixelIndex = newPixels.findIndex(
								p => p.x === pixelUpdate.x && p.y === pixelUpdate.y
							);

							if (existingPixelIndex >= 0) {
								newPixels[existingPixelIndex] = {
									...newPixels[existingPixelIndex],
									color: pixelUpdate.color
								};
							} else {
								// Ajouter un nouveau pixel
								newPixels.push({
									x: pixelUpdate.x,
									y: pixelUpdate.y,
									color: pixelUpdate.color
								});
							}

							return newPixels;
						});
			} catch (error) {
				console.error('Erreur lors du traitement du message WebSocket:', error);
			}
		};
		webSocketRef.current = ws;

		return () => {
			if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
				ws.close();
			}
		};
	}, [pixelBoard._id]);

	// Fonction pour centrer le canvas
    const centerCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
    
        // Obtenez les dimensions du wrapper
        const wrapper = canvas.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;
    
        // Obtenez la taille de la grille et calculez la taille d'un pixel
        const gridSize = pixelBoard.size;
        const pixelSize = Math.min(wrapperWidth, wrapperHeight) / gridSize;
    
        // Calculez les offsets pour centrer la grille dans le canvas
        const offsetX = (wrapperWidth - gridSize * pixelSize) / 2;
        const offsetY = (wrapperHeight - gridSize * pixelSize) / 2;
    
        // Mettez à jour les offsets et réinitialisez le zoom
        setOffset({ x: offsetX, y: offsetY });
        setScale(1);
    };

    // Fonction pour animer le hover
    const animateHover = (targetOpacity) => {
        if (hoverAnimationRef.current) {
            cancelAnimationFrame(hoverAnimationRef.current);
        }

        const step = () => {
            setHoverOpacity((prev) => {
                const diff = targetOpacity - prev;
                if (Math.abs(diff) < 0.05) return targetOpacity; // Évite les petites oscillations
                return prev + diff * 0.01; // Interpolation progressive
            });
            hoverAnimationRef.current = requestAnimationFrame(step);
        };
        hoverAnimationRef.current = requestAnimationFrame(step);
    };

    // Fonction de dessin du canvas
    const drawBoard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
    
        // Obtenez les dimensions du wrapper
        const wrapper = canvas.parentElement;
        const wrapperWidth = wrapper.offsetWidth;
        const wrapperHeight = wrapper.offsetHeight;
    
        // Ajustez les dimensions du canvas
        canvas.width = wrapperWidth;
        canvas.height = wrapperHeight;
    
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);
    
        const gridSize = pixelBoard.size;
        const pixelSize = Math.min(wrapperWidth, wrapperHeight) / gridSize;
    
        // Dessiner le fond
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, gridSize * pixelSize, gridSize * pixelSize);
    
        // Dessiner les pixels existants
        pixels.forEach(({ x, y, color }) => {
            ctx.fillStyle = color || "#fff";
            ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        });
    
        // Dessiner la grille
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * pixelSize, 0);
            ctx.lineTo(i * pixelSize, gridSize * pixelSize);
            ctx.stroke();
    
            ctx.beginPath();
            ctx.moveTo(0, i * pixelSize);
            ctx.lineTo(gridSize * pixelSize, i * pixelSize);
            ctx.stroke();
        }

        // Effet hover sur le pixel survolé
        if (hoveredPixel) {
            ctx.save();
            const hoverPadding = pixelSize * 0.15; // 15% de padding pour l'effet hover
            ctx.globalAlpha = hoverOpacity; // Opacité animée
            ctx.fillStyle = "rgba(255, 255, 255, 0.45)";
            ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
            ctx.shadowBlur = 8; // Ajout d’un glow

            // Effet hover avec scaling progressif
            ctx.fillRect(
                hoveredPixel.x * pixelSize - hoverPadding,
                hoveredPixel.y * pixelSize - hoverPadding,
                pixelSize + 2 * hoverPadding,
                pixelSize + 2 * hoverPadding
            );

            ctx.globalAlpha = 1; // Reset de l’opacité
            ctx.restore();
        }
        ctx.restore();
    };

    useEffect(() => {
        drawBoard();
    }, [scale, offset, pixelBoard, pixels, hoveredPixel, hoverOpacity]);

// Gestion du zoom via la molette (en zoomant à partir du curseur)
useEffect(() => {
    const canvas = canvasRef.current;
    const handleWheel = (e) => {
        e.preventDefault();
        
        // 1. Obtenir la position du curseur par rapport au canvas
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        // 2. Calculer la position du point sous le curseur avant le zoom
        const pointXBeforeZoom = (mouseX - offset.x) / scale;
        const pointYBeforeZoom = (mouseY - offset.y) / scale;
        
        // 3. Calculer le nouveau facteur de zoom
        const scaleAmount = 0.1;
        const newScale = e.deltaY < 0 ? scale + scaleAmount : scale - scaleAmount;
        const finalScale = Math.max(newScale, 0.1); // Limiter le niveau de zoom minimum
        
        // 4. Calculer la nouvelle position du point après le zoom
        const pointXAfterZoom = pointXBeforeZoom * finalScale;
        const pointYAfterZoom = pointYBeforeZoom * finalScale;
        
        // 5. Ajuster l'offset pour que le point sous le curseur reste au même endroit
        const newOffsetX = mouseX - pointXAfterZoom;
        const newOffsetY = mouseY - pointYAfterZoom;
        
        // 6. Mettre à jour le scale et l'offset
        setScale(finalScale);
        setOffset({
            x: newOffsetX,
            y: newOffsetY
        });
    };
    
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
        canvas.removeEventListener("wheel", handleWheel);
    };
}, [scale, offset]);
    
    
    const handleMouseDown = async (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        // Initialisation du glissement potentiel
        isClickRef.current = true;
        isDraggingRef.current = false;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };
        
        // Démarrer un timer pour déterminer si c'est un clic ou un glissement
        clickTimerRef.current = setTimeout(() => {
            isClickRef.current = false;
        }, 150); // 150ms est un bon délai pour différencier un clic et un glissement
    };
    
    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        
        // Si le bouton de la souris est enfoncé et qu'on a déplacé suffisamment
        if (e.buttons === 1) {  // Bouton gauche enfoncé
            const dx = e.clientX - lastMousePosRef.current.x;
            const dy = e.clientY - lastMousePosRef.current.y;
            
            // Si on bouge suffisamment, c'est un glissement et non un clic
            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                isClickRef.current = false;
                isDraggingRef.current = true;
            }
            
            if (isDraggingRef.current) {
                // Mise à jour de la position pour le glissement
                lastMousePosRef.current = { x: e.clientX, y: e.clientY };
                setOffset((prev) => ({
                    x: prev.x + dx,
                    y: prev.y + dy,
                }));
                setHoveredPixel(null);
                animateHover(0);
            }
        } else {
            // Gestion du survol normal (sans glissement)
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const gridSize = pixelBoard.size;
            const boardDimension = Math.min(canvas.width, canvas.height);
            const pixelSize = boardDimension / gridSize;
            const transformedX = (mouseX - offset.x) / scale;
            const transformedY = (mouseY - offset.y) / scale;
            const pixelX = Math.floor(transformedX / pixelSize);
            const pixelY = Math.floor(transformedY / pixelSize);
            
            if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
                setHoveredPixel({ x: pixelX, y: pixelY });
                animateHover(1);
            } else {
                setHoveredPixel(null);
                animateHover(0);
            }
        }
        
        drawBoard();
    };
    
    const handleMouseUp = async (e) => {
        // Si c'était un simple clic (pas un glissement), colorer le pixel
        if (isClickRef.current) {
            clearTimeout(clickTimerRef.current);
            
            const canvas = canvasRef.current;
            const rect = canvas.getBoundingClientRect();
            const gridSize = pixelBoard.size;
            const boardDimension = Math.min(canvas.width, canvas.height);
            const pixelSize = boardDimension / gridSize;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const transformedX = (mouseX - offset.x) / scale;
            const transformedY = (mouseY - offset.y) / scale;
            const pixelX = Math.floor(transformedX / pixelSize);
            const pixelY = Math.floor(transformedY / pixelSize);

            if (pixelX >= 0 && pixelX < gridSize && pixelY >= 0 && pixelY < gridSize) {
                const newPixels = [...pixels];
                const existingPixel = newPixels.find(p => p.x === pixelX && p.y === pixelY);
                const pixelData = {
                    boardId: pixelBoard._id,
                    x: pixelX,
                    y: pixelY,
                    color: selectedColor,
                    userId: user?._id,
                };

                const flashMessageContainer = document.getElementById("flash-message");
                const root = createRoot(flashMessageContainer);

                if (existingPixel && !pixelBoard.mode) {
                    root.render(
                        <FlashMessage duration={5000}>
                            <p>Vous ne pouvez pas écraser un pixel existant.</p>
                        </FlashMessage>
                    );
                    return;
                }

                try {
                    const res = await axios.post("http://localhost:8000/api/pixels", pixelData);

                    if (res.data.error === enums.PixelStatus.DELAY_NOT_RESPECTED) {
                        root.render(
                            <FlashMessage duration={5000}>
                                <p>{res.data.message}</p>
                            </FlashMessage>
                        );
                        return;
                    }

                    // Envoi du pixel via WebSocket
                    if (webSocketRef.current && webSocketRef.current.readyState === WebSocket.OPEN) {
                        const wsMessage = {
                            data: pixelData
                        };
                        webSocketRef.current.send(JSON.stringify(wsMessage));
                    }

                    // Mise à jour de l'état avec les nouveaux pixels
                    const updatedPixels = await axios.get(`http://localhost:8000/api/pixels/${pixelBoard._id}`);
                    setPixels(updatedPixels.data);
                } catch (err) {
                    root.render(
                        <FlashMessage duration={5000}>
                            <p>Erreur lors de l'envoi du pixel.</p>
                        </FlashMessage>
                    );
                }
            }
        }
        
        // Réinitialiser les états de glissement
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
		axios.get(`http://localhost:8000/api/pixels/${pixelBoard._id}`).then((response) => {
			setPixels(response.data);
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
});

export default PixelCanvas;
