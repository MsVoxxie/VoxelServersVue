<script setup lang="ts">
const props = defineProps<{
	title: string;
	value: number;
	maxValue: number;
	unit: string;
	color: string;
}>();

const displayValue = computed(() => {
	if (props.unit === 'MB') {
		return `${(props.value / 1024).toFixed(1)}`;
	}
	return props.value;
});
const displayMax = computed(() => {
	if (props.unit === 'MB') {
		return `${(props.maxValue / 1024).toFixed(0)}`;
	}
	return props.maxValue;
});
const displayUnit = computed(() => (props.unit === 'MB' ? 'GB' : props.unit));
</script>

<template>
	<div>
		<div class="mb-1 flex justify-between text-sm font-medium text-white">
			<span>{{ title }}</span>
			<span>{{ displayValue }} / {{ displayMax }} {{ displayUnit }}</span>
		</div>
		<div class="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
			<div class="h-2 rounded-full transition-all duration-1000" :style="{ width: (value / maxValue) * 100 + '%', backgroundColor: color }"></div>
		</div>
	</div>
</template>
