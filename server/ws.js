import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { $fetch } from 'ofetch';

// Load environment variables from .env file
try {
	const { config } = await import('dotenv');
	config();
} catch (error) {
	// dotenv not available, continue without it
}

// Store clients by instance
const instanceClients = {};

// Configuration for API forwarding
const API_BASE_URL = process.env.API_BASE_URL;
const API_SECRET = process.env.API_SECRET;
const WS_PORT = process.env.WS_PORT || 2002;

// Global variables to store server instances
let wss = null;
let httpServer = null;
let serverInitialized = false;

// Function to forward chat messages to the game server API
async function forwardToGameAPI(user, instance, message, serverGame) {
	if (!API_SECRET) {
		return;
	}

	try {
		const response = await $fetch(`${API_BASE_URL}/server/client_to_server`, {
			method: 'POST',
			body: JSON.stringify({
				user,
				instance,
				message,
				serverGame,
			}),
			headers: {
				Authorization: `Bearer ${API_SECRET}`,
				'Content-Type': 'application/json',
			},
		});

		return response;
	} catch (error) {
		console.error('Failed to forward to game API:', error);
		return { error: 'Failed to forward to game API', details: error.message };
	}
}

// Function to initialize the WebSocket server (singleton pattern)
function initializeWebSocketServer() {
	if (serverInitialized) {
		return wss; // Return existing instance
	}

	try {
		// Create HTTP server for handling broadcast requests
		httpServer = createServer((req, res) => {
			// Handle broadcast requests from Nuxt API
			if (req.method === 'POST' && req.url === '/broadcast') {
				let body = '';
				req.on('data', (chunk) => {
					body += chunk.toString();
				});
				req.on('end', () => {
					try {
						const { instance, message } = JSON.parse(body);
						broadcastToInstance(instance, message);
						res.writeHead(200, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ success: true }));
					} catch (error) {
						res.writeHead(400, { 'Content-Type': 'application/json' });
						res.end(JSON.stringify({ error: 'Invalid request' }));
					}
				});
			} else {
				res.writeHead(404, { 'Content-Type': 'application/json' });
				res.end(JSON.stringify({ error: 'Not found' }));
			}
		});

		// Create WebSocket server using the HTTP server
		wss = new WebSocketServer({ server: httpServer });

		// Start listening
		httpServer.listen(WS_PORT, () => {
			console.log(`WebSocket server initialized on port ${WS_PORT}`);
		});

		serverInitialized = true;
		return wss;
	} catch (error) {
		if (error.code === 'EADDRINUSE') {
			console.log(`WebSocket server already running on port ${WS_PORT}`);
			serverInitialized = true;
			return null; // Server already running
		}
		throw error;
	}
}

// Initialize the WebSocket server
const server = initializeWebSocketServer();

// Only set up event handlers if we successfully created/got the server
if (server) {
	wss = server; // Ensure our global variable is set

	wss.on('connection', (ws, req) => {
		try {
			const url = new URL(req.url || '', `http://${req.headers.host}`);
			const instance = url.searchParams.get('instance');
			if (!instance) {
				ws.close();
				return;
			}
			if (!instanceClients[instance]) instanceClients[instance] = [];
			instanceClients[instance].push(ws);

			// Store instance on the WebSocket for reference
			ws.instance = instance;

			// Handle incoming messages from clients
			ws.on('message', async (data) => {
				try {
					const message = JSON.parse(data.toString());

					// If this is a chat message, forward it to the game API
					if (message.type === 'chat') {
						const { user, message: chatText, moduleName, module } = message;
						if (user && chatText) {
							// Forward to game API (don't wait for response to avoid blocking)
							forwardToGameAPI(user, instance, chatText, moduleName || module).catch((error) => {
								console.error('API forwarding failed:', error);
							});
						}
					}

					// Broadcast the message to all clients in this instance (including sender)
					broadcastToInstance(instance, message);
				} catch (error) {
					console.error('Error parsing message:', error);
				}
			});

			ws.on('close', () => {
				instanceClients[instance] = instanceClients[instance].filter((client) => client !== ws);
			});
		} catch (e) {
			console.error('WebSocket connection error:', e);
			ws.close();
		}
	});

	// Error handling and logging for the WebSocket server
	wss.on('error', (error) => {
		console.error('WebSocket server error:', error);
	});

	wss.on('listening', () => {
		console.log(`WebSocket server is listening on port ${WS_PORT}`);
	});

	if (!API_SECRET) {
		console.warn('Warning: API_SECRET not set - messages will not be forwarded to game server');
	}
}

// Broadcast a message to all clients in a specific instance
export function broadcastToInstance(instance, message) {
	if (instanceClients[instance]) {
		instanceClients[instance].forEach((ws) => {
			if (ws.readyState === ws.OPEN) {
				try {
					ws.send(JSON.stringify(message));
				} catch (error) {
					console.error('Error sending message to client:', error);
				}
			}
		});
	}
}

// Export function to get the WebSocket server instance
export function getWebSocketServer() {
	return wss;
}

// Export function to check if server is running
export function isServerRunning() {
	return wss !== null;
}
