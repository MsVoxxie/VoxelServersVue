import { defineEventHandler, readBody } from 'h3';
import { useRuntimeConfig } from '#imports';
import { $fetch } from 'ofetch';

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();
	const body = await readBody(event);
	const { user, instance, message } = body;
	if (!message) {
		return { error: 'No message provided' };
	}

	const baseUrl = `${config.public.baseApiURI}/server/client_to_server`;
	try {
		const data = await $fetch(baseUrl, {
			method: 'POST',
			body: JSON.stringify({ user, instance, message }),
			headers: {
				Authorization: `Bearer ${config.apiSecret}`,
				'Content-Type': 'application/json',
			},
		});
		return data;
	} catch (e: any) {
		const errorMessage = e && typeof e === 'object' && 'message' in e ? (e as any).message : 'Unknown error';
		return { error: 'Failed to send message', details: errorMessage };
	}
});
