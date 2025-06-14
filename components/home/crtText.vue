<template>
	<span class="crt-text" :style="{ fontSize, color: textColor }">
		{{ text }}
		<span class="crt-scanlines"></span>
	</span>
</template>

<script setup lang="ts">
const props = defineProps<{ text: string; fontSize?: string; color?: string }>();
const fontSize = props.fontSize || '1rem';
const textColor = props.color || 'inherit';
</script>

<style scoped>
.crt-text {
	position: relative;
	display: inline-block;
	font-family: 'Press Start 2P', monospace;
	font-weight: bold;
	letter-spacing: 0.08em;
	vertical-align: middle;
	/* color is inherited from prop */
}

.crt-scanlines {
	pointer-events: none;
	position: absolute;
	left: 0;
	top: 0;
	right: 0;
	bottom: 0;
	background: repeating-linear-gradient(
		to bottom,
		transparent 0px,
		transparent 2px,
		rgba(0, 255, 128, 0.18) 2px,
		rgba(0, 255, 128, 0.18) 3px,
		transparent 3px,
		transparent 4px
	);
	mix-blend-mode: luminosity;
	opacity: 0.7;
	animation: crt-scan 1.2s linear infinite;
	z-index: 1;
	border-radius: 0.05em; /* helps with some font rendering */
}

@keyframes crt-scan {
	0% {
		background-position-y: 0;
	}
	100% {
		background-position-y: 4px;
	}
}
</style>
