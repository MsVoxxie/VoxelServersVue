<template>
	<div class="flex flex-col items-center justify-center text-center">
		<span v-if="!isPending" class="font-mono text-lg text-yellow-400"> Releases in {{ countdown }} </span>
		<span v-else class="font-mono text-lg text-red-500"> Pending... </span>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps<{
	releaseDate: string;
}>();

// Correctly parse ISO string or timestamp
const targetTimestamp = computed(() => {
	return Date.parse(props.releaseDate);
});

const now = ref(Date.now());
let interval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	if (targetTimestamp.value) {
		interval = setInterval(() => {
			now.value = Date.now();
		}, 1000);
	}
});
onUnmounted(() => {
	if (interval) clearInterval(interval);
});

const isPending = computed(() => !targetTimestamp.value || now.value >= targetTimestamp.value);
const countdown = computed(() => {
	if (!targetTimestamp.value) return '';
	let diff = Math.max(0, Math.floor((targetTimestamp.value - now.value) / 1000));
	const days = Math.floor(diff / 86400);
	diff %= 86400;
	const hours = Math.floor(diff / 3600);
	diff %= 3600;
	const minutes = Math.floor(diff / 60);
	const seconds = diff % 60;
	let out = '';
	if (days > 0) out += `${days}d `;
	if (hours > 0 || days > 0) out += `${hours}h `;
	if (minutes > 0 || hours > 0 || days > 0) out += `${minutes}m `;
	out += `${seconds}s`;
	return out.trim();
});
</script>
