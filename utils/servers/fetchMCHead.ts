export default function fetchMCHead(username: string): string {
	const config = useRuntimeConfig();
	return `${config.public.baseApiURI}/client/playerheads/${encodeURIComponent(username)}`;
}
