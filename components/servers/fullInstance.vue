<template>
	<section class="w-full h-fit flex flex-col md:flex-row bg-black/80 rounded-2xl shadow-2xl mt-4 overflow-hidden">
		<!-- Sidebar: Player List -->
		<aside class="hidden md:flex md:w-64 lg:w-72 xl:w-80 bg-gray-900/80 p-4 md:p-6 flex-shrink-0 flex-col border-r border-white/20 min-h-0">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-lg md:text-xl font-semibold text-white">Players</h2>
				<span class="text-xs md:text-sm text-gray-300 font-mono">{{ players.length }} / {{ maxPlayers }}</span>
			</div>
			<!-- Player list fills sidebar and scrolls if needed -->
			<div class="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto relative max-h-[50vh] md:max-h-[60vh] lg:max-h-[70vh] grow">
				<div v-for="i in maxPlayers" :key="i" class="relative" style="min-height: 44px">
					<div class="flex items-center gap-2 bg-gray-800/40 px-3 py-2 rounded-lg opacity-60 w-full transition-opacity duration-150" :class="{ 'opacity-0': players[i - 1] }">
						<div class="w-6 h-6 rounded-full bg-gray-700/40"></div>
						<div class="h-4 w-3/4 bg-gray-700/40 rounded"></div>
					</div>
					<!-- Player card (slides in/out over placeholder) -->
					<Transition name="player-slide">
						<div
							v-if="players[i - 1]"
							:key="players[i - 1].UserID"
							class="absolute inset-0 flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-lg w-full"
							style="z-index: 1"
						>
							<playerHead :player="{ name: players[i - 1]?.Username, uuid: players[i - 1]?.UserID }" :module="instance.Module" />
						</div>
					</Transition>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 flex flex-col gap-2 p-3 md:p-4 relative">
			<!-- Auth Section - Top Right Corner -->
			<div class="absolute top-3 right-3 md:top-4 md:right-4 z-10">
				<div v-if="user" class="flex items-center gap-2 md:gap-3">
					<div class="text-right hidden sm:block">
						<div class="text-white text-xs md:text-sm font-semibold">Welcome back,</div>
						<div class="text-primary-400 text-xs md:text-sm">{{ nickOrName }}</div>
					</div>
					<div class="relative w-8 h-8 md:w-10 md:h-10 group cursor-pointer" @click="logout" title="Log out">
						<img
							:src="user.image"
							:alt="user.name"
							class="absolute inset-0 w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 shadow object-cover transition-all duration-500 group-hover:opacity-0 group-hover:rotate-180"
							v-if="user.image"
						/>
						<span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
							<LucideLogOut class="w-6 h-6 md:w-8 md:h-8 text-red-400 bg-white/80 rounded-full p-1 md:p-1.5" />
						</span>
					</div>
				</div>
				<button
					v-else
					type="button"
					@click="loginWithDiscord"
					class="flex items-center gap-1 md:gap-2 group bg-gray-900/80 hover:bg-gray-800/80 border border-white/20 rounded-xl px-2 md:px-4 py-1.5 md:py-2 shadow transition-colors"
					title="Sign in with Discord"
				>
					<img :src="discordIcon" class="w-5 h-5 md:w-6 md:h-6 object-contain" aria-hidden="true" />
					<span class="text-white text-xs md:text-sm font-medium">Sign in</span>
				</button>
			</div>

			<!-- Header: Game Icon, Name, Status -->
			<div class="flex items-center gap-3 md:gap-6 mb-2 pr-12 md:pr-20">
				<div class="relative">
					<!-- <img :src="instance.Icon" class="h-16 md:h-20 lg:h-25 rounded-xl shadow-lg border-2 border-white/20 bg-gray-900 object-cover" /> -->
					<!-- Status Bar with Text -->
					<div
						class="absolute bottom-0 left-0 right-0 h-5 md:h-6 rounded-b-lg flex items-center justify-center text-xs md:text-sm font-semibold text-white shadow-lg"
						:class="{
							'bg-green-500/90': instance.AppState === 'Running',
							'bg-yellow-500/90': instance.AppState === 'Starting',
							'bg-red-500/90': instance.AppState === 'Stopped' || instance.AppState === 'Offline',
							'bg-gray-500/90': !['Running', 'Starting', 'Stopped', 'Offline'].includes(instance.AppState),
						}"
					>
						{{ instance.AppState }}
					</div>
				</div>
				<div class="flex-1 min-w-0">
					<h1 class="text-xl md:text-3xl lg:text-4xl font-bold text-white">
						<span class="truncate block">{{ instance.FriendlyName || instance.InstanceName }}</span>
					</h1>
					<div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
						<span class="text-gray-300 text-sm md:text-lg">{{ instance.ModuleDisplayName?.replace('Seven Days To Die', '7D2D') || instance.Module }}</span>
						<a
							v-if="(instance.Module === 'Minecraft' || instance.ModuleDisplayName === 'Seven Days To Die') && instance.WelcomeMessage"
							:href="instance.WelcomeMessage"
							target="_blank"
							rel="noopener"
							class="inline-flex hover:translate-y-0.5 transition-transform duration-200"
						>
							<NuxtBadge trailing-icon="i-lucide-arrow-right" size="sm" color="primary" class="pt-0 pb-0 text-sm font-bold">Modpack</NuxtBadge>
						</a>
					</div>
				</div>
			</div>

			<!-- Mobile Player List (collapsible) -->
			<section class="md:hidden bg-gray-900/80 rounded-xl p-3 shadow mb-2">
				<button @click="showMobilePlayers = !showMobilePlayers" class="flex items-center justify-between w-full text-left">
					<h2 class="text-lg font-semibold text-white">Players</h2>
					<div class="flex items-center gap-2">
						<span class="text-sm text-gray-300 font-mono">{{ players.length }} / {{ maxPlayers }}</span>
						<span class="transform transition-transform duration-200" :class="{ 'rotate-180': showMobilePlayers }"> ▼ </span>
					</div>
				</button>
				<Transition name="mobile-players">
					<div v-if="showMobilePlayers" class="mt-3 max-h-48 overflow-y-auto">
						<div class="grid grid-cols-1 gap-2">
							<div v-for="player in players" :key="player.UserID" class="flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-lg">
								<playerHead :player="{ name: player.Username, uuid: player.UserID }" :module="instance.Module" />
							</div>
							<div v-if="players.length === 0" class="text-gray-400 text-center py-4">No players online</div>
						</div>
					</div>
				</Transition>
			</section>

			<!-- Bar Graphs Section -->
			<section class="bg-gray-900/80 rounded-xl p-3 md:p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
				<h2 class="text-base md:text-lg font-semibold text-white mb-2">Server Stats</h2>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
					<BarGraph key="cpu" :history="23" title="CPU" :value="instance.Metrics.cpu.RawValue" :max="instance.Metrics.cpu.MaxValue" color="#3B82F6" />
					<BarGraph
						key="memory"
						:history="23"
						title="Memory"
						:value="instance.Metrics.memory.RawValue"
						:max="instance.Metrics.memory.MaxValue"
						color="#10B981"
						:unit="instance.Metrics.memory.Units"
					/>
					<BarGraph
						v-if="instance.Metrics.performance"
						key="performance"
						:history="23"
						title="Performance"
						:value="instance.Metrics.performance.RawValue"
						:max="instance.Metrics.performance.MaxValue"
						color="#F59E42"
						:unit="instance.Metrics.performance.Units"
					/>
				</div>
			</section>

			<!-- Details & Network Section Side by Side -->
			<section class="grid grid-cols-1 md:grid-cols-2 gap-2">
				<!-- Server Details -->
				<div class="bg-gray-900/80 rounded-xl p-3 md:p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
					<h2 class="text-base md:text-lg font-semibold text-white">Server Details</h2>
					<div class="px-1">
						<div>
							<!-- <div v-if="instance.currentTime !== null" class="text-gray-400 text-sm">Current State:</div>
							<div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
								<div v-if="instance.currentTime !== null" :class="Number(instance.currentTime.day) % 7 === 0 ? 'text-red-500' : 'text-white'" class="text-sm md:text-base">
									Day {{ instance.currentTime.day }}
								</div>
								<div v-if="instance.currentTime !== null" class="text-white text-sm md:text-base">| {{ instance.currentTime.time }}</div>
							</div>
							<div v-if="instance.pack_version" class="text-gray-400 text-sm mt-2">Modpack Version:</div>
							<div v-if="instance.pack_version" class="text-white text-sm md:text-base">{{ instance.pack_version || 'N/A' }}</div> -->
							<div class="text-gray-400 text-sm mt-2">Description:</div>
							<div class="text-white text-sm md:text-base break-words">{{ instance.Description || 'No description.' }}</div>
							<div class="text-gray-400 text-sm mt-2">IP Address:</div>
							<div class="mt-1">
								<ServerConnection text="" serverState="Running" :ip="instance.IP" :port="instance.Port" />
							</div>
						</div>
					</div>
				</div>
				<!-- Network Info -->
				<div class="bg-gray-900/80 rounded-xl p-3 md:p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
					<h2 class="text-base md:text-lg font-semibold text-white">Network Overview</h2>
					<div class="flex justify-between gap-2 px-1">
						<div class="flex-1">
							<div class="text-gray-400 text-sm">Your Ping:</div>
							<div class="flex items-center gap-2">
								<div class="font-mono text-base md:text-lg" :class="getPingColor(userPing)">
									{{ userPing !== null ? `${userPing} ms` : 'Testing...' }}
								</div>
							</div>
							<div class="text-gray-400 text-sm">Your Average:</div>
							<div class="font-mono text-sm md:text-base" :class="getPingColor(averagePing)">
								{{ averagePing !== null ? `${averagePing} ms` : 'N/A' }}
							</div>
							<div class="text-gray-400 text-sm">Your Median:</div>
							<div class="font-mono text-sm md:text-base" :class="getPingColor(medianPing)">
								{{ medianPing !== null ? `${medianPing} ms` : 'N/A' }}
							</div>
						</div>
						<div class="flex-1">
							<div class="text-gray-400 text-sm">Servers Ping:</div>
							<div class="font-mono text-sm md:text-base" :class="getPingColor(network.externalPing)">{{ network.externalPing }} ms</div>
							<div class="text-gray-400 text-sm">Servers Average:</div>
							<div class="font-mono text-sm md:text-base" :class="getPingColor(network.externalAvg)">{{ network.externalAvg }} ms</div>
							<div class="text-gray-400 text-sm">Servers Median:</div>
							<div class="font-mono text-sm md:text-base" :class="getPingColor(network.externalMedian)">{{ network.externalMedian }} ms</div>
						</div>
					</div>
				</div>
			</section>
			<ServerChat
				:instanceId="instanceId"
				:linkStatus="linkStatus"
				:isAuthenticated="isAuthenticated"
				:nickOrName="nickOrName"
				:serverGame="instance.ModuleDisplayName || instance.Module"
			/>
		</main>
	</section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { LucideLogOut } from 'lucide-vue-next';
import { siDiscord } from 'simple-icons';
import { useAuth } from '#imports';
import borderColor from '~/utils/servers/stateColor';
import type { ExtendedInstance } from '~/types/servers/instanceTypes';
import ServerConnection from './serverConnection.vue';
import BarGraph from './barGraph.vue';
import playerHead from './basicPlayer.vue';
import ServerChat from './serverChat.vue';

const config = useRuntimeConfig();

const { signIn, signOut, data } = useAuth();
const isAuthenticated = computed(() => !!data.value?.user);
const nickOrName = computed(() => data.value?.user.member?.nick || data.value?.user.member?.user.global_name || data.value?.user.name || 'Unknown');

interface CustomUser {
	name: string;
	image: string;
	id?: string;
	guilds?: any[];
}

const user = computed(() => data.value?.user as CustomUser | undefined);

const discordIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent(siDiscord.svg.replace(/fill="[^"]*"/g, 'fill="#5865F2"'));

function loginWithDiscord() {
	signIn('discord', { callbackUrl: window.location.pathname });
}

function logout() {
	signOut({ callbackUrl: window.location.pathname });
}

const route = useRoute();
const instanceId = route.params.id as string;

// Mobile UI state
const showMobilePlayers = ref(false);

const props = defineProps<{
	instance: ExtendedInstance;
	network: any;
	linkStatus: boolean;
}>();

// Ping measurement functionality
const userPing = ref<number | null>(null);
const pingHistory = ref<number[]>([]);
const averagePing = ref<number | null>(null);
const medianPing = ref<number | null>(null);
const isTestingPing = ref(false);
let pingInterval: NodeJS.Timeout | null = null;

// Function to test user's ping to the server
async function testUserPing(): Promise<number | null> {
	try {
		isTestingPing.value = true;
		const startTime = performance.now();

		// Use a dedicated ping endpoint for more reliable results
		await fetch(`${config.public.baseApiURI}/server/ping`, {
			method: 'GET',
			cache: 'no-cache',
		});

		const endTime = performance.now();
		return Math.round(endTime - startTime);
	} catch (error) {
		console.warn('Ping test failed:', error);
		return null;
	} finally {
		isTestingPing.value = false;
	}
}

// Update ping statistics
function updatePingStats(newPing: number) {
	userPing.value = newPing;

	// Keep last 10 ping measurements for average/median
	pingHistory.value.push(newPing);
	if (pingHistory.value.length > 10) {
		pingHistory.value.shift();
	}

	// Calculate average
	averagePing.value = Math.round(pingHistory.value.reduce((sum, ping) => sum + ping, 0) / pingHistory.value.length);

	// Calculate median
	const sortedPings = [...pingHistory.value].sort((a, b) => a - b);
	const mid = Math.floor(sortedPings.length / 2);
	medianPing.value = sortedPings.length % 2 === 0 ? Math.round((sortedPings[mid - 1] + sortedPings[mid]) / 2) : sortedPings[mid];
}

// Get ping color based on value
const getPingColor = (ping: number | null) => {
	if (ping === null) return 'text-gray-400';
	if (ping < 50) return 'text-green-400';
	if (ping < 100) return 'text-yellow-400';
	if (ping < 200) return 'text-orange-400';
	return 'text-red-400';
};

// Start ping testing when component mounts
onMounted(async () => {
	// Initial ping test
	const initialPing = await testUserPing();
	if (initialPing !== null) {
		updatePingStats(initialPing);
	}

	// Set up interval for continuous ping testing (responsive interval based on screen size)
	const isMobile = window.innerWidth < 768;
	const pingIntervalMs = isMobile ? 10000 : 5000; // 10s on mobile, 5s on desktop

	pingInterval = setInterval(async () => {
		const ping = await testUserPing();
		if (ping !== null) {
			updatePingStats(ping);
		}
	}, pingIntervalMs);
});

// Clean up interval when component unmounts
onUnmounted(() => {
	if (pingInterval) {
		clearInterval(pingInterval);
	}
});

// Replace legacy instance properties with ExtendedInstance properties
// Example changes:
// - instance.welcomeMessage -> instance.WelcomeMessage
// - instance.pack_version -> instance.pack_version (if present)
// - instance.server -> instance.Metrics (metrics are now in Metrics)
// - instance.players -> instance.Metrics.users.PlayerList (if present)
// - instance.server.state -> instance.AppState
// - instance.server.cpu -> instance.Metrics.cpu
// - instance.server.memory -> instance.Metrics.memory
// - instance.server.performance -> instance.Metrics.performance
// - instance.server.ip/port -> instance.ip/port (if present)
// - instance.server.currentTime -> instance.currentTime (if present)

// Update computed properties
const maxPlayers = computed(() => props.instance.Metrics.users?.MaxValue || 0);
const players = computed(() => props.instance.Metrics.users?.PlayerList || []);

// Update template usages (examples):
// <span class="text-xs md:text-sm text-gray-300 font-mono">{{ players.length }} / {{ maxPlayers }}</span>
// <playerHead :player="players[i - 1]" :module="instance.module" :moduleName="instance.moduleName" />
// <img :src="instance.icon" ... />
// <div :class="{ 'bg-green-500/90': instance.AppState === 'Running', ... }">{{ instance.AppState }}</div>
// <BarGraph :value="instance.Metrics.cpu.RawValue" :max="instance.Metrics.cpu.MaxValue" ... />
// <BarGraph :value="instance.Metrics.memory.RawValue" :max="instance.Metrics.memory.MaxValue" ... />
// <BarGraph v-if="instance.Metrics.performance" :value="instance.Metrics.performance.RawValue" :max="instance.Metrics.performance.MaxValue" ... />
// <ServerConnection :ip="instance.ip" :port="instance.port" ... />
// <div v-if="instance.currentTime !== null">Day {{ instance.currentTime.day }} | {{ instance.currentTime.time }}</div>
// <ServerChat :serverGame="instance.moduleName || instance.module" ... />
</script>

<style scoped>
.player-slide-enter-active,
.player-slide-leave-active {
	transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.player-slide-enter-from {
	opacity: 0;
	transform: translateX(-40px);
}
.player-slide-enter-to {
	opacity: 1;
	transform: translateX(0);
}
.player-slide-leave-from {
	opacity: 1;
	transform: translateX(0);
}
.player-slide-leave-to {
	opacity: 0;
	transform: translateX(-40px);
}

.mobile-players-enter-active,
.mobile-players-leave-active {
	transition: all 0.3s ease-in-out;
}
.mobile-players-enter-from,
.mobile-players-leave-to {
	opacity: 0;
	max-height: 0;
	transform: translateY(-10px);
}
.mobile-players-enter-to,
.mobile-players-leave-from {
	opacity: 1;
	max-height: 200px;
	transform: translateY(0);
}
</style>
