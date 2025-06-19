<template>
	<div ref="container" class="w-full h-28 flex flex-col relative select-none">
		<!-- Title and current value -->
		<div class="flex items-center justify-between px-1 pb-1 text-nowrap">
			<span class="text-xs text-white/80 font-semibold">{{ title }}</span>
			<span class="text-xs text-white/60 font-mono">
				<template v-if="title.toLowerCase() === 'cpu' || unit === '%'"> {{ Math.min(values[values.length - 1] ?? 0, max).toFixed(0) }}/{{ max }}% </template>
				<template v-else-if="unit === 'MB'"> {{ (Math.min(values[values.length - 1] ?? 0, max) / 1024).toFixed(1) }}/{{ maxDisplay }} </template>
				<template v-else> {{ Math.min(values[values.length - 1] ?? 0, max) }}/{{ maxDisplay }} </template>
			</span>
		</div>
		<!-- Bar graph -->
		<div class="flex-1 flex items-end bg-gray-900/80 rounded-lg p-2 overflow-visible gap-[2px] relative">
			<!-- Tooltip rendered once, positioned absolutely at cursor -->
			<div
				v-if="hoveredIndex !== null && values[hoveredIndex] !== undefined"
				class="absolute z-20 px-2 py-1 rounded bg-black/90 text-xs text-white whitespace-nowrap pointer-events-none"
				:style="tooltipStyle"
			>
				<template v-if="title.toLowerCase() === 'cpu' || unit === '%'"> {{ Math.min(values[hoveredIndex], max).toFixed(0) }}% </template>
				<template v-else-if="unit === 'MB'"> {{ (Math.min(values[hoveredIndex], max) / 1024).toFixed(1) }} GB </template>
				<template v-else> {{ Math.min(values[hoveredIndex], max) }}{{ unit ? ` ${unit}` : '' }} </template>
			</div>
			<!-- Bars -->
			<div
				v-for="(v, i) in values"
				:key="i"
				:style="{
					height: `${Math.max(4, (Math.min(v, max) / (max || 1)) * 100)}%`,
					width: `${barWidth}px`,
					background: color,
					borderRadius: '3px',
					position: 'relative',
				}"
				class="transition-all duration-50 cursor-pointer"
				@mouseenter="hoveredIndex = i"
				@mouseleave="hoveredIndex = null"
				@mousemove="onBarMouseMove($event)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const props = defineProps<{
	title?: string;
	value: number;
	max: number;
	color?: string;
	unit?: string;
}>();

const container = ref<HTMLElement | null>(null);
const barWidth = 6; // px
const barGap = 2; // px
const barCount = ref(23); // default

function updateBarCount() {
	if (container.value) {
		const width = container.value.offsetWidth;
		barCount.value = Math.max(5, Math.floor(width / (barWidth + barGap)));
	}
}

let resizeObserver: ResizeObserver | null = null;
const values = ref<number[]>([]);
let intervalId: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	updateBarCount();
	resizeObserver = new ResizeObserver(updateBarCount);
	if (container.value) resizeObserver.observe(container.value);

	intervalId = setInterval(() => {
		values.value.push(props.value);
		while (values.value.length > barCount.value) values.value.shift();
	}, 2500);
});
onUnmounted(() => {
	if (resizeObserver && container.value) resizeObserver.unobserve(container.value);
	if (intervalId) clearInterval(intervalId);
});

watch(barCount, (newCount) => {
	while (values.value.length < newCount) values.value.unshift(0);
	while (values.value.length > newCount) values.value.shift();
});

const color = computed(() => props.color || '#3B82F6');
const unit = computed(() => props.unit || '');
const title = computed(() => props.title || '');
const max = computed(() => props.max || 100);
const maxDisplay = computed(() => {
	if (props.unit === 'MB') {
		return `${(props.max / 1024).toFixed(1)} GB`;
	}
	return `${props.max} ${props.unit || ''}`;
});

// Tooltip state
const hoveredIndex = ref<number | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);

function onBarMouseMove(e: MouseEvent) {
	if (!container.value) return;
	const rect = container.value.getBoundingClientRect();
	tooltipX.value = e.clientX - rect.left;
	tooltipY.value = e.clientY - rect.top;
}

// Tooltip positioning
const tooltipStyle = computed(() => {
	if (hoveredIndex.value === null || !container.value) return {};
	const tooltipWidth = 60; // px, estimate
	const tooltipHeight = 28; // px, estimate
	const minLeft = 0;
	const maxLeft = container.value.offsetWidth - tooltipWidth;
	const minTop = 0;
	const maxTop = container.value.offsetHeight - tooltipHeight;
	const left = Math.max(minLeft, Math.min(tooltipX.value, maxLeft));
	const top = Math.max(minTop, Math.min(tooltipY.value - tooltipHeight - 18, maxTop));
	return {
		left: `${left}px`,
		top: `${top}px`,
	};
});
</script>
