export interface NetworkData {
	externalPing: string; // e.g. "27.2"
	externalAvg: string; // e.g. "24.3"
	externalMedian: string; // e.g. "23.6"
	externalHistory: number[]; // e.g. [26, 23.5, ...]
	networkAlive: boolean;
	internalUp: string; // e.g. "0.77"
	internalDown: string; // e.g. "0.17"
	lastSpike: string; // e.g. "✓ Stable"
	lastSpikeTime: string | null; // e.g. null or ISO
}
