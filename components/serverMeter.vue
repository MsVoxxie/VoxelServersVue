<script setup lang="ts">
defineProps<{
	title: string;
	value: number;
	maxValue: number;
	color: string;
}>();
</script>
<template>
	<div>
		<div class="mb-1 flex justify-between text-xs font-medium text-white">
			<span>{{ title }}</span>
			<span>{{ value }} / {{ maxValue }}</span>
		</div>
		<div class="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
			<div class="h-3 rounded-full transition-all duration-300" :style="{ width: (value / maxValue) * 100 + '%', backgroundColor: color }"></div>
		</div>
	</div>
</template>
