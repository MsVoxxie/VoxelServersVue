export async function getChatData() {
	const config = useRuntimeConfig();
	const baseUrl = `${config.public.baseApiURI}/server/server_to_client`;
	const data = await $fetch(baseUrl, { method: 'GET' });
	return data;
}

export async function sendChatMessage(user: string, instance: string, message: string) {
	try {
		const data = await $fetch('/api/chat/send', {
			method: 'POST',
			body: { user, instance, message },
		});
		return data;
	} catch (error) {
		console.error('Failed to send chat message:', error);
		return { error: 'Failed to send chat message', details: error };
	}
}
