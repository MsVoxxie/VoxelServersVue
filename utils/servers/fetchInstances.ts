import type { InstanceResponse } from '~/types/servers/instanceTypes';

export default async function fetchInstances() {
	const config = useRuntimeConfig();
	const route = useRoute();
	const baseUrl = `${config.public.baseApiURI}/server/data/instances`;

	const getInstances = async () => {
		const response = await useFetch<InstanceResponse>(baseUrl, { method: 'GET' });
		return response;
	};

	const getInstance = async () => {
		const instanceId = route.params.id;
		const url = `${baseUrl}/${instanceId}`;
		const { data } = await useFetch<InstanceResponse>(url, { method: 'GET' });
		return data.value as InstanceResponse;
	};

	return { getInstances, getInstance };
}
