import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import { broadcastToInstance } from '../../ws';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	// Check Bearer token
	const authHeader = event.node.req.headers['authorization'];
	const expected = `Bearer ${config.apiSecret}`;
	if (!authHeader || authHeader !== expected) {
		console.log('[API] Unauthorized access attempt');
		return { error: 'Unauthorized' };
	}

	const body = await readBody(event);
	const { user, instance, message } = body;
	if (!message || !instance) {
		return { error: 'No message or instance provided' };
	}

	// Broadcast to all websocket clients for this instance
	broadcastToInstance(instance, { user, message, instance, from: 'game' });
	return { broadcast: true };
});
