import { WebSocketServer } from 'ws';

// Store clients by instance
const instanceClients = {};

const wss = new WebSocketServer({ port: 2002 }); // You can change the port if needed

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
		// Only log client-facing connection
		console.log(`[WS] Client connected for instance ${instance}. Total: ${instanceClients[instance].length}`);

		ws.on('close', () => {
			instanceClients[instance] = instanceClients[instance].filter((client) => client !== ws);
			// Only log client-facing disconnection
			console.log(`[WS] Client disconnected from instance ${instance}. Remaining: ${instanceClients[instance].length}`);
		});
	} catch (e) {
		ws.close();
	}
});

export function broadcastToInstance(instance, message) {
	if (instanceClients[instance]) {
		// Remove excessive broadcast logs
		instanceClients[instance].forEach((ws) => {
			if (ws.readyState === ws.OPEN) {
				ws.send(JSON.stringify(message));
			}
		});
	}
}
