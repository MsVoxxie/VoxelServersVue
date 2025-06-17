export default function fetchSteamHead(steam64: string): string {
	const config = useRuntimeConfig();
	return `${config.public.steamHeadsURI}/${encodeURIComponent(steam64)}`;
}
