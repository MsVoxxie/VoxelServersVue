<template>
	<div :style="{ fontSize, filter: 'var(--letter-shadow)' }" class="font-mono inline-block use-p2-font">
		<span>{{ text }}</span
		><span class="blinker">_</span>
	</div>
</template>

<script setup lang="ts">
defineProps<{ text: string; fontSize?: string }>();
</script>

<style scoped>
.blinker {
	animation: blink 1s steps(1) infinite;
}
@keyframes blink {
	0%,
	50% {
		opacity: 1;
	}
	51%,
	100% {
		opacity: 0;
	}
}
</style>
