import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';

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

	// Broadcast to all websocket clients for this instance via HTTP request
	// This avoids importing the WebSocket module directly
	try {
		const wsPort = process.env.WS_PORT || 2002;
		await $fetch(`http://localhost:${wsPort}/broadcast`, {
			method: 'POST',
			body: JSON.stringify({
				instance,
				message: { user, message, instance, from: 'game' }
			}),
			headers: {
				'Content-Type': 'application/json',
			},
		});
		return { broadcast: true };
	} catch (error) {
		console.error('Failed to broadcast to WebSocket clients:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return { error: 'Failed to broadcast message', details: errorMessage };
	}
});
