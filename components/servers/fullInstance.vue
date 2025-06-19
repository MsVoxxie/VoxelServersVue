<template>
	<section class="w-full h-fit flex flex-col md:flex-row bg-black/80 rounded-2xl shadow-2xl mt-4 overflow-hidden">
		<!-- Sidebar: Player List -->
		<aside class="hidden md:flex md:w-72 bg-gray-900/80 p-6 flex-shrink-0 flex-col border-r border-white/20 min-h-0">
			<div class="flex items-center justify-between mb-4">
				<h2 class="text-xl font-semibold text-white">Players</h2>
				<span class="text-sm text-gray-300 font-mono">{{ players.length }} / {{ maxPlayers }}</span>
			</div>
			<!-- Player list fills sidebar and scrolls if needed -->
			<div class="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto relative">
				<div v-for="i in maxPlayers" :key="i" class="relative" style="min-height: 44px">
					<div class="flex items-center gap-2 bg-gray-800/40 px-3 py-2 rounded-lg opacity-60 w-full transition-opacity duration-150" :class="{ 'opacity-0': players[i - 1] }">
						<div class="w-6 h-6 rounded-full bg-gray-700/40"></div>
						<div class="h-4 w-3/4 bg-gray-700/40 rounded"></div>
					</div>
					<!-- Player card (slides in/out over placeholder) -->
					<Transition name="player-slide">
						<div
							v-if="players[i - 1]"
							:key="players[i - 1].uuid"
							class="absolute inset-0 flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-lg w-full"
							style="z-index: 1"
						>
							<playerHead :player="players[i - 1]" :module="instance.module" :moduleName="instance.moduleName" />
							<span v-if="players[i - 1].name" class="text-xs text-green-400 ml-2">{{ players[i - 1].name }}</span>
						</div>
					</Transition>
				</div>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 flex flex-col gap-2 p-4">
			<!-- Header: Game Icon, Name, Status -->
			<div class="flex items-center gap-6 mb-2">
				<img :src="instance.icon" class="h-25 rounded-xl shadow-lg border-2 border-white/20 bg-gray-900 object-cover" />
				<div>
					<h1 class="text-4xl font-bold text-white flex items-center gap-2">
						{{ instance.friendlyName || instance.instanceName }}
						<span class="text-base px-3 py-1 rounded-full font-semibold ml-2" :class="borderColor(instance.server.state).bg">
							{{ instance.server.state }}
						</span>
					</h1>
					<div class="flex items-center gap-2 mt-1">
						<span class="text-gray-300 text-lg">{{ instance.moduleName || instance.module }}</span>
						<a
							v-if="instance.module === 'Minecraft' && instance.welcomeMessage"
							:href="instance.welcomeMessage"
							target="_blank"
							rel="noopener"
							class="inline-flex hover:translate-y-0.5 transition-transform duration-200"
						>
							<NuxtBadge trailing-icon="i-lucide-arrow-right" size="sm" color="primary" class="pt-0 pb-0 text-sm font-bold">Modpack</NuxtBadge>
						</a>
					</div>
				</div>
			</div>

			<!-- Bar Graphs Section -->
			<section class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
				<h2 class="text-lg font-semibold text-white mb-2">Server Stats</h2>
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
					<BarGraph key="cpu" :history="23" title="CPU" :value="instance.server.cpu.RawValue" :max="instance.server.cpu.MaxValue" color="#3B82F6" />
					<BarGraph
						key="memory"
						:history="23"
						title="Memory"
						:value="instance.server.memory.RawValue"
						:max="instance.server.memory.MaxValue"
						color="#10B981"
						:unit="instance.server.memory.Units"
					/>
					<BarGraph
						v-if="instance.server.performance"
						key="performance"
						:history="23"
						title="Performance"
						:value="instance.server.performance.RawValue"
						:max="instance.server.performance.MaxValue"
						color="#F59E42"
						:unit="instance.server.performance.Units"
					/>
				</div>
			</section>

			<!-- Details & Network Section Side by Side -->
			<section class="grid grid-cols-1 md:grid-cols-2 gap-2">
				<!-- Server Details -->
				<div class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
					<h2 class="text-lg font-semibold text-white">Server Details</h2>
					<div class="flex justify-between px-1">
						<div>
							<div v-if="instance.server.currentTime !== null" class="text-gray-400">Current State:</div>
							<div class="flex items-center gap-2">
								<div v-if="instance.server.currentTime !== null" :class="Number(instance.server.currentTime.day) % 7 === 0 ? 'text-red-500' : 'text-white'">
									Day {{ instance.server.currentTime.day }}
								</div>
								<div v-if="instance.server.currentTime !== null" class="text-white">| {{ instance.server.currentTime.time }}</div>
							</div>
							<div v-if="instance.pack_version" class="text-gray-400">Modpack Version:</div>
							<div v-if="instance.pack_version" class="text-white">{{ instance.pack_version || 'N/A' }}</div>
							<div class="text-gray-400">Description:</div>
							<div class="text-white">{{ instance.description || 'No description.' }}</div>
							<div class="text-gray-400">IP Address:</div>
							<ServerConnection text="" serverState="Running" :ip="instance.server.ip" :port="instance.server.port" />
						</div>
					</div>
				</div>
				<!-- Network Info -->
				<div class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-2 divide-y divide-white/20">
					<h2 class="text-lg font-semibold text-white">Network</h2>
					<div class="flex justify-between px-1">
						<div>
							<div class="text-gray-400">External Ping:</div>
							<div class="text-white font-mono text-lg">{{ network.externalPing }} ms</div>
							<div class="text-gray-400">Average:</div>
							<div class="text-white">{{ network.externalAvg }} ms</div>
							<div class="text-gray-400">Median:</div>
							<div class="text-white">{{ network.externalMedian }} ms</div>
						</div>
						<div>
							<div class="text-gray-400">Internal Up:</div>
							<div class="text-white">{{ network.internalUp }} MB/s</div>
							<div class="text-gray-400">Internal Down:</div>
							<div class="text-white">{{ network.internalDown }} MB/s</div>
							<div class="text-gray-400">Last Spike:</div>
							<div class="text-white">{{ network.lastSpike }}</div>
						</div>
					</div>
				</div>
			</section>
			<ServerChat :instanceId="instanceId" :linkStatus="linkStatus" :isAuthenticated="isAuthenticated" :nickOrName="nickOrName" />
		</main>
	</section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuth } from '#imports';
import borderColor from '~/utils/servers/stateColor';
import type { Instance } from '~/types/servers/instanceTypes';
import ServerConnection from './serverConnection.vue';
import BarGraph from './barGraph.vue';
import playerHead from './basicPlayer.vue';
import ServerChat from './serverChat.vue';

const { data } = useAuth();
const isAuthenticated = computed(() => !!data.value?.user);
const nickOrName = computed(() => data.value?.user.member?.nick || data.value?.user.name || 'Unknown');

const route = useRoute();
const instanceId = route.params.id as string;

const props = defineProps<{
	instance: Instance;
	network: any;
	linkStatus: boolean;
}>();

const maxPlayers = computed(() => props.instance.server.users?.MaxValue || 0);
const players = computed(() => props.instance.players || []);
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
</style>
