export default function fetchMCHead(username: string): string {
	const config = useRuntimeConfig();
	return `${config.public.mcHeadsURI}/${encodeURIComponent(username)}`;
}
