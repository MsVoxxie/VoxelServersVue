import type { InstanceResponse } from '~/types/instanceTypes';

export default async function getInstances(id?: string) {
	const config = useRuntimeConfig();
	const baseUrl = config.public.instanceURI;
	const url = id ? `${baseUrl}/${encodeURIComponent(id)}` : baseUrl;
	const data: InstanceResponse = await $fetch(url, { method: 'GET' });
	return data;
}
