import type { InstanceResponse } from '~/types/instances';

export default async function getInstances() {
	const config = useRuntimeConfig();
	const data: InstanceResponse = await $fetch(config.instanceURI, { method: "GET" });
	return data;
}
