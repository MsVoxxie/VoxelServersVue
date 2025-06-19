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
						<div v-if="players[i - 1]" :key="players[i - 1].id" class="absolute inset-0 flex items-center gap-2 bg-gray-800/80 px-3 py-2 rounded-lg w-full" style="z-index: 1">
							<playerHead :player="players[i - 1]" :module="instance.module" :moduleName="instance.moduleName" />
							<span v-if="players[i - 1].status" class="text-xs text-green-400 ml-2">{{ players[i - 1].status }}</span>
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
					<div class="text-gray-300 text-lg mt-1">{{ instance.moduleName || instance.module }}</div>
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
							<div class="text-gray-400">IP Address:</div>
							<div class="text-white font-mono">{{ instance.server.ip }}:{{ instance.server.port }}</div>
							<div class="text-gray-400 mt-2">Modpack Version:</div>
							<div class="text-white">{{ instance.pack_version || 'N/A' }}</div>
							<div class="text-gray-400 mt-2">Description:</div>
							<div class="text-white">{{ instance.description || 'No description.' }}</div>
						</div>
						<div>
							<div>
								<div class="text-gray-400">Placeholder Title</div>
								<div class="text-white">Placeholder Data</div>
								<div class="text-gray-400 mt-2">Placeholder Title</div>
								<div class="text-white">Placeholder Data</div>
								<div class="text-gray-400 mt-2">Placeholder Title</div>
								<div class="text-white">Placeholder Data</div>
							</div>
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
							<div class="text-gray-400 mt-2">Average:</div>
							<div class="text-white">{{ network.externalAvg }} ms</div>
							<div class="text-gray-400 mt-2">Median:</div>
							<div class="text-white">{{ network.externalMedian }} ms</div>
						</div>
						<div>
							<div class="text-gray-400">Internal Up:</div>
							<div class="text-white">{{ network.internalUp }} MB/s</div>
							<div class="text-gray-400 mt-2">Internal Down:</div>
							<div class="text-white">{{ network.internalDown }} MB/s</div>
							<div class="text-gray-400 mt-2">Last Spike:</div>
							<div class="text-white">{{ network.lastSpike }}</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Chatbox/Console (Always visible, blurred if not authenticated) -->
			<section class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-1 relative">
				<h2 class="text-lg font-semibold text-white mb-2">Server Chat</h2>
				<div class="relative">
					<div ref="chatBox" class="h-20 overflow-y-auto bg-black/60 rounded p-2 mb-2">
						<div v-for="msg in messages" :key="msg.id" class="text-xs text-white mb-1">
							<span class="font-bold text-primary-400">{{ msg.user }}:</span> {{ msg.text }}
						</div>
						<!-- Overlay for unauthenticated users or if linkStatus is false, only over chat area -->
						<div v-if="!isAuthenticated || !props.linkStatus" class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs rounded z-10">
							<span class="text-white text-lg font-bold">
								{{ !isAuthenticated ? 'Authentication Required' : 'Server Unlinked' }}
							</span>
						</div>
					</div>
				</div>
				<div class="flex gap-2">
					<input
						v-model="chatInput"
						@keyup.enter="sendMessage"
						type="text"
						:disabled="!isAuthenticated || !props.linkStatus"
						placeholder="Type a message..."
						class="flex-1 bg-gray-800 text-white rounded px-3 py-2 outline-none"
					/>
					<button
						@click="sendMessage"
						:disabled="!isAuthenticated || !props.linkStatus"
						class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
					>
						Send
					</button>
				</div>
			</section>
		</main>
	</section>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '#imports';
import borderColor from '~/utils/servers/stateColor';
import BarGraph from './barGraph.vue';
import playerHead from './basicPlayer.vue';
import { sendChatMessage } from '~/utils/servers/chatCalls';

const { data } = useAuth();
const isAuthenticated = computed(() => !!data.value?.user);
const nickOrName = computed(() => data.value?.user.member?.nick || data.value?.user.name || 'Unknown');

const route = useRoute();
const instanceId = route.params.id as string;

interface ChatMessage {
	id: number;
	user: string;
	text: string;
}

const messages = ref<ChatMessage[]>([]);
const chatInput = ref('');
const chatBox = ref<HTMLElement | null>(null);

async function sendMessage() {
	if (chatInput.value.trim()) {
		messages.value.push({ id: Date.now(), user: nickOrName.value || 'Unknown', text: chatInput.value });

		try {
			// Use the shared sendChatMessage utility
			await sendChatMessage(nickOrName.value || 'You', instanceId, chatInput.value);
		} catch (error) {
			console.error('Failed to send chat message:', error);
			// Optionally show a toast or error message to the user here
		}

		chatInput.value = '';
		scrollChatToBottom();
	}
}

function scrollChatToBottom() {
	nextTick(() => {
		if (chatBox.value) {
			chatBox.value.scrollTop = chatBox.value.scrollHeight;
		}
	});
}

watch(messages, scrollChatToBottom, { deep: true });

const props = defineProps<{
	instance: any;
	network: any;
	linkStatus: boolean;
}>();

function copyIp() {
	navigator.clipboard.writeText(`${props.instance.server.ip}:${props.instance.server.port}`);
}

const maxPlayers = computed(() => props.instance.server.users?.MaxValue || 0);
const players = computed(() => props.instance.players || []);

// WebSocket client for real-time chat
let ws: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function getWebSocketUrl(instanceId: string) {
	const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
	let host = window.location.host;
	// If running on localhost, force port 3002 for dev
	if (host.startsWith('localhost')) {
		host = 'localhost:3002';
	}
	// If proxied in production, use /ws path
	return `${protocol}://${host}/ws?instance=${instanceId}`;
}

function connectWebSocket() {
	ws = new WebSocket(getWebSocketUrl(instanceId));

	ws.onopen = () => {
		console.log('[WS CLIENT] Connected');
		reconnectAttempts = 0;
	};

	ws.onmessage = (event) => {
		console.log('[WS CLIENT] Received message:', event.data);
		const msg = JSON.parse(event.data);
		messages.value.push({
			id: Date.now(),
			user: msg.user,
			text: msg.message,
		});
		scrollChatToBottom();
	};

	ws.onclose = () => {
		console.log('[WS CLIENT] Disconnected');
		attemptReconnect();
	};

	ws.onerror = (err) => {
		console.error('[WS CLIENT] Error:', err);
		ws?.close();
	};
}

function attemptReconnect() {
	if (reconnectAttempts < maxReconnectAttempts) {
		const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000); // Exponential backoff, max 30s
		reconnectTimeout = setTimeout(() => {
			reconnectAttempts++;
			console.log(`[WS CLIENT] Reconnecting... attempt ${reconnectAttempts}`);
			connectWebSocket();
		}, delay);
	} else {
		console.error('[WS CLIENT] Max reconnect attempts reached.');
	}
}

onMounted(() => {
	if (props.linkStatus) {
		messages.value.push({ id: 1, user: 'SERVER', text: 'Initialized' });
		connectWebSocket();
	} else {
		messages.value.push({ id: 0, user: 'SERVER', text: 'Disconnected' });
	}
});

onBeforeUnmount(() => {
	if (ws) ws.close();
	if (reconnectTimeout) clearTimeout(reconnectTimeout);
});
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
