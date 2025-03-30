const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });

const boardConnections = new Map();

function broadcastToBoard(boardId, message) {
	if (!boardConnections.has(boardId)) return;

	const clients = boardConnections.get(boardId);
	const messageStr = JSON.stringify(message);

	clients.forEach(client => {
		if (client.readyState === 1) { // WebSocket.OPEN
			client.send(messageStr);
		}
	});
}
wss.on('headers', (headers, req) => {
	headers.push('Access-Control-Allow-Origin: *');
});


wss.on('connection', (ws, req) => {
	const url = new URL(req.url, `http://${req.headers.host}`);
	const pathParts = url.pathname.split('/');
	const boardId = pathParts[pathParts.length - 1];

	if (!boardId) {
		ws.close(1008, 'Board ID required');
		return;
	}


	if (!boardConnections.has(boardId)) {
		boardConnections.set(boardId, new Set());
	}
	boardConnections.get(boardId).add(ws);
	console.log(boardConnections.get(boardId).size);

	// Add message handler for this specific connection
	ws.on('message', async (message) => {
		const parsedMessage = JSON.parse(message);

		console.log(`Message reçu de ${boardId}: ${message}`);
		try {
			await placePixel(parsedMessage);
		} catch (error) {
			console.error('Erreur de parsing du message:', error);
		}
	});

	ws.on('close', () => {
		console.log(`Client déconnecté du tableau: ${boardId}`);

		if (boardConnections.has(boardId)) {
			boardConnections.get(boardId).delete(ws);

			if (boardConnections.get(boardId).size === 0) {
				boardConnections.delete(boardId);
			}
		}
	});
});


wss.on('message', async (message) => {
	console.log(`Message reçu: ${message}`);
	await placePixel(message);
});


const placePixel = async (message) => {
	try {
		const { boardId, x, y, color, userId } = message.data

		broadcastToBoard(boardId, {
			data: {
				x,
				y,
				color
			}
		});

	} catch (error) {
		console.error('Erreur lors du placement du pixel:', error);
	}
};

const PORT =  3000;
server.listen(PORT, () => {
	console.log(`Serveur en écoute sur le port ${PORT}`);
});
