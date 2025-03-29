import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import axios from "axios";

const PixelCanvas = forwardRef(({ pixelBoard, onPixelColorChange, user }, ref) => {
	const colors = ["#FF5733", "#33FF57", "#3357FF", "#FFFF33", "#FF33FF", "#33FFFF", "#000000", "#FFFFFF"];
	const [selectedColor, setSelectedColor] = useState(colors[0]);
	const [pixels, setPixels] = useState([]);
	const canvasRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredPixel, setHoveredPixel] = useState(null);
    const [hoverOpacity, setHoverOpacity] = useState(0);
    const hoverAnimationRef = useRef(null);

    // Références pour le panning
    const isDraggingRef = useRef(false);
    const lastMousePosRef = useRef({ x: 0, y: 0 });

    // Exposer la méthode resetView au parent
    useImperativeHandle(ref, () => ({
        resetView() {
            centerCanvas();
        }
    }));

    // Fonction pour centrer le canvas
    const centerCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gridSize = pixelBoard.size;
        const boardDimension = Math.min(window.innerWidth, window.innerHeight);
        const pixelSize = boardDimension / gridSize;

        const offsetX = (canvas.width - gridSize * pixelSize) / 2;
        const offsetY = (canvas.height - gridSize * pixelSize) / 2;

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

        // Le canvas occupe toute la fenêtre
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.save();
        // Appliquer le panning et le zoom
        ctx.translate(offset.x, offset.y);
        ctx.scale(scale, scale);

        const gridSize = pixelBoard.size;
        const boardDimension = Math.min(window.innerWidth, window.innerHeight);
        const pixelSize = boardDimension / gridSize;

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

    // Gestion du zoom via la molette (empêche le scroll global)
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

	// Handle mouse dragging and hovering
	const handleMouseDown = async (e) => {
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
			if (existingPixel) {
				existingPixel.color = selectedColor;
			} else {
				newPixels.push({x: pixelX, y: pixelY, color: selectedColor});
			}
			setPixels(newPixels);
			onPixelColorChange?.({x: pixelX, y: pixelY, color: selectedColor});
			await axios.post("http://localhost:8000/api/pixels", {
				boardId: pixelBoard._id,
				x: pixelX,
				y: pixelY,
				color: selectedColor,
				userId: user?._id,
			});
		}
	};

    const handleMouseMove = (e) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();

        if (isDraggingRef.current) {
            const dx = e.clientX - lastMousePosRef.current.x;
            const dy = e.clientY - lastMousePosRef.current.y;
            lastMousePosRef.current = { x: e.clientX, y: e.clientY };
            setOffset((prev) => ({
                x: prev.x + dx,
                y: prev.y + dy,
            }));
            setHoveredPixel(null);
            animateHover(0); // Réduire progressivement l'effet hover
        } else {
            // Calculer la position relative au canvas
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
                animateHover(1); // Démarrer l'animation smooth
            } else {
                setHoveredPixel(null);
                animateHover(0); // Réduire progressivement l'effet hover
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
        animateHover(0); // Réduire progressivement l'effet hover
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
		<>
			<div className="absolute top-0 left-0">
				<div className="">
					{colors.map((color) => (
						<button
							key={color}
							className=""
							style={{
								backgroundColor: color,
								borderColor: selectedColor === color ? "#000" : "transparent",
								transform: selectedColor === color ? "scale(1.15)" : "scale(1)"
							}}
							onClick={() => setSelectedColor(color)}
						/>
					))}
				</div>
			</div>
			<canvas
				ref={canvasRef}
				className="absolute top-0 left-0"
				onMouseDown={handleMouseDown}
				onMouseMove={handleMouseMove}
				onMouseUp={handleMouseUp}
				onMouseLeave={handleMouseLeave}
			/>
		</>
	);
});

export default PixelCanvas;
