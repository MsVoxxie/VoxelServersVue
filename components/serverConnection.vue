<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
	serverState: string;
	ip?: string;
	port?: string | number;
}>();

const copied = ref(false);

function copyToClipboard() {
	if (props.ip && props.port) {
		navigator.clipboard.writeText(`${props.ip}:${props.port}`);
		copied.value = true;
		setTimeout(() => (copied.value = false), 1200);
	}
}
</script>

<template>
	<div v-if="serverState === 'Running'">
		<div class="text-sm text-gray-300 mb-1">Connect</div>
		<div class="bg-gray-800 font-mono text-white text-sm p-2 rounded-lg flex items-center justify-center space-x-2">
			<code>{{ ip }}:{{ port }}</code>
			<button class="text-blue-400 hover:text-blue-200" @click.prevent.stop="copyToClipboard">
				<span v-if="!copied">Copy</span>
				<span v-else>Copied!</span>
			</button>
		</div>
	</div>
</template>
