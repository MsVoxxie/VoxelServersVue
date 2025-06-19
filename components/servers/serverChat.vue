<template>
	<section class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-1 relative">
		<h2 class="text-lg font-semibold text-white mb-2">Server Chat</h2>
		<div class="relative">
			<div ref="chatBox" class="h-20 overflow-y-auto bg-black/60 rounded p-2 mb-2">
				<div v-for="msg in messages" :key="msg.id" class="text-xs text-white mb-1">
					<span class="font-bold text-primary-400">{{ msg.user }}:</span> {{ msg.text }}
				</div>
				<!-- Overlay for unauthenticated users or if linkStatus is false, only over chat area -->
				<div v-if="!isAuthenticated || !linkStatus" class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs rounded z-10">
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
				:disabled="!isAuthenticated || !linkStatus"
				placeholder="Type a message..."
				class="flex-1 bg-gray-800 text-white rounded px-3 py-2 outline-none"
			/>
			<button
				@click="sendMessage"
				:disabled="!isAuthenticated || !linkStatus"
				class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
			>
				Send
			</button>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { sendChatMessage } from '~/utils/servers/chatCalls';

const props = defineProps<{
	instanceId: string;
	linkStatus: boolean;
	isAuthenticated: boolean;
	nickOrName: string;
}>();

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
		messages.value.push({ id: Date.now(), user: props.nickOrName || 'Unknown', text: chatInput.value });
		try {
			await sendChatMessage(props.nickOrName || 'You', props.instanceId, chatInput.value);
		} catch (error) {
			console.error('Failed to send chat message:', error);
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

// WebSocket client for real-time chat
let ws: WebSocket | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 10;

function getWebSocketUrl(instanceId: string) {
	const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
	let host = window.location.host;
	if (host.startsWith('localhost')) {
		host = 'localhost:2002';
	}
	return `${protocol}://${host}/ws?instance=${instanceId}`;
}

function connectWebSocket() {
	ws = new WebSocket(getWebSocketUrl(props.instanceId));
	ws.onopen = () => {
		console.log('[WS CLIENT] Connected');
		reconnectAttempts = 0;
		messages.value.push({ id: Date.now(), user: 'SERVER', text: 'Connected.' });
	};
	ws.onmessage = (event) => {
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
		messages.value.push({ id: Date.now(), user: 'SERVER', text: 'Disconnected.' });
		attemptReconnect();
	};
	ws.onerror = (err) => {
		console.error('[WS CLIENT] Error:', err);
		ws?.close();
	};
}

function attemptReconnect() {
	if (props.isAuthenticated && props.linkStatus && reconnectAttempts < maxReconnectAttempts) {
		const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
		reconnectTimeout = setTimeout(() => {
			reconnectAttempts++;
			console.log(`[WS CLIENT] Reconnecting... [${reconnectAttempts}/${maxReconnectAttempts}]`);
			connectWebSocket();
		}, delay);
	} else {
		console.error('[WS CLIENT] Max reconnect attempts reached or not eligible.');
	}
}

onMounted(() => {
	if (props.isAuthenticated && props.linkStatus) {
		messages.value.push({ id: 1, user: 'SERVER', text: 'Initializing...' });
		connectWebSocket();
	} else if (!props.linkStatus) {
		messages.value.push({ id: 0, user: 'SERVER', text: 'Disconnected' });
	} else if (!props.isAuthenticated) {
		messages.value.push({ id: 0, user: 'SERVER', text: 'Authentication Required' });
	}
});

watch(
	() => [props.isAuthenticated, props.linkStatus],
	([authed, linked], [oldAuthed, oldLinked]) => {
		if (authed && linked && (!oldAuthed || !oldLinked)) {
			// If just became eligible, connect
			connectWebSocket();
		} else if ((!authed || !linked) && oldAuthed && oldLinked) {
			// If just became ineligible, disconnect
			if (ws) ws.close();
			if (reconnectTimeout) clearTimeout(reconnectTimeout);
		}
	}
);

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
