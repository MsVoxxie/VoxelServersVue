<template>
	<section class="bg-gray-900/80 rounded-xl p-4 shadow flex flex-col gap-1 relative">
		<h2 class="text-lg font-semibold text-white mb-2">Server Chat</h2>
		<div class="relative">
			<div ref="chatBox" class="h-20 overflow-y-auto bg-black/60 rounded p-2 mb-2">
				<div v-for="msg in messages" :key="msg.id" class="text-xs text-white mb-1">
					<span class="font-bold text-primary-400">{{ msg.user }}:</span> {{ msg.text }}
				</div>
				<!-- Overlay for unauthenticated users or if linkStatus is false, only over chat area -->
				<div v-if="!isAuthenticatedForced || !linkStatus" class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-xs rounded z-10">
					<span class="text-white text-lg font-bold">
						{{ !isAuthenticatedForced ? 'Authentication Required' : 'Server Unlinked' }}
					</span>
				</div>
			</div>
		</div>
		<div class="flex gap-2">
			<input
				v-model="chatInput"
				@keyup.enter="sendMessage"
				type="text"
				:disabled="!isAuthenticatedForced || !linkStatus"
				placeholder="Type a message..."
				class="flex-1 bg-gray-800 text-white rounded px-3 py-2 outline-none"
			/>
			<button
				@click="sendMessage"
				:disabled="!isAuthenticatedForced || !linkStatus"
				class="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded font-bold disabled:opacity-50"
			>
				Send
			</button>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref, nextTick, watch, onMounted, onBeforeUnmount, computed } from 'vue';

const props = defineProps<{
	instanceId: string;
	linkStatus: boolean;
	isAuthenticated: boolean;
	nickOrName: string;
	serverGame?: string;
}>();

interface ChatMessage {
	id: number;
	user: string;
	text: string;
}

const messages = ref<ChatMessage[]>([]);
const chatInput = ref('');
const chatBox = ref<HTMLElement | null>(null);

// Use actual authentication status
const isAuthenticatedForced = computed(() => {
	return props.isAuthenticated;
});

// Use actual user name from props
const tempSenderName = computed(() => {
	return props.nickOrName || 'Unknown';
});

async function sendMessage() {
	if (chatInput.value.trim()) {
		const messageText = chatInput.value.trim();
		const senderName = tempSenderName.value;

		// Clear input immediately for better UX
		chatInput.value = '';

		try {
			// Send message directly through WebSocket instead of REST API
			if (ws && ws.readyState === WebSocket.OPEN) {
				const message = {
					type: 'chat',
					instanceId: props.instanceId,
					user: senderName,
					message: messageText,
					timestamp: new Date().toISOString(),
					source: 'web',
					moduleName: props.serverGame || 'web',
					module: props.serverGame || 'web',
				};

				ws.send(JSON.stringify(message));
			} else {
				throw new Error('WebSocket connection is not open');
			}
		} catch (error) {
			console.error('Failed to send chat message:', error);
			// Add an error message if sending failed
			messages.value.push({
				id: Date.now(),
				user: 'System',
				text: 'Failed to send message. Please try again.',
			});
			// Restore the message in input for retry
			chatInput.value = messageText;
		}
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
let heartbeatInterval: ReturnType<typeof setInterval> | null = null;
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
		reconnectAttempts = 0;

		// Start heartbeat to keep connection alive
		heartbeatInterval = setInterval(() => {
			if (ws && ws.readyState === WebSocket.OPEN) {
				ws.send(JSON.stringify({ type: 'ping', instanceId: props.instanceId }));
			}
		}, 30000);
	};

	ws.onmessage = (event) => {
		try {
			const msg = JSON.parse(event.data);

			// Skip system messages from appearing in chat
			if (msg.type === 'ping' || msg.type === 'connection_test' || msg.type === 'client_connect') {
				return;
			}

			// Handle chat messages specifically
			if (msg.type === 'chat') {
				const newMessage = {
					id: Date.now() + Math.random(),
					user: msg.user || msg.username || msg.sender || msg.from || msg.player || 'Unknown',
					text: msg.message || msg.text || msg.content || msg.msg || String(msg.message || msg),
				};

				messages.value.push(newMessage);
				scrollChatToBottom();
				return;
			}

			// Handle other message formats that might come from the server (legacy support)
			const newMessage = {
				id: Date.now() + Math.random(),
				user: msg.user || msg.username || msg.sender || msg.from || msg.player || 'Unknown',
				text: msg.message || msg.text || msg.content || msg.msg || String(msg),
			};

			messages.value.push(newMessage);
			scrollChatToBottom();
		} catch (error) {
			// If it's not JSON, treat it as plain text
			const plainTextMessage = {
				id: Date.now() + Math.random(),
				user: 'Server',
				text: event.data,
			};

			messages.value.push(plainTextMessage);
			scrollChatToBottom();
		}
	};

	ws.onclose = (event) => {
		// Clear heartbeat interval
		if (heartbeatInterval) {
			clearInterval(heartbeatInterval);
			heartbeatInterval = null;
		}

		attemptReconnect();
	};

	ws.onerror = (err) => {
		console.error('WebSocket error occurred:', err);
		ws?.close();
	};
}

function attemptReconnect() {
	if (isAuthenticatedForced.value && props.linkStatus && reconnectAttempts < maxReconnectAttempts) {
		const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000);
		reconnectTimeout = setTimeout(() => {
			reconnectAttempts++;
			connectWebSocket();
		}, delay);
	}
}

onMounted(() => {
	if (isAuthenticatedForced.value && props.linkStatus) {
		messages.value.push({ id: 1, user: 'SERVER', text: 'Ready' });
		connectWebSocket();
	} else if (!props.linkStatus) {
		messages.value.push({ id: 0, user: 'SERVER', text: 'Disconnected' });
	} else if (!isAuthenticatedForced.value) {
		messages.value.push({ id: 0, user: 'SERVER', text: 'Authentication Required' });
	}
});

watch(
	() => [isAuthenticatedForced.value, props.linkStatus],
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
	if (heartbeatInterval) clearInterval(heartbeatInterval);
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
