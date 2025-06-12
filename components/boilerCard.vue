<template>
	<div class="flex flex-wrap gap-8 max-w-screen-xl w-full justify-center">
		<div
			v-for="n in count"
			:key="n"
			class="instance-card group relative rounded-lg overflow-visible shadow-lg flex flex-col justify-between w-[425px] animate-pulse"
		>
			<!-- Background Layer: Clipped Blur -->
			<div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
				<div class="absolute inset-0 bg-gray-900 rounded-2xl"></div>
				<div class="w-full h-full bg-gray-800 filter blur-md"></div>
				<div class="absolute inset-0 bg-black/50"></div>
			</div>
			<!-- BorderStyling -->
			<div class="absolute inset-0 border-2 pointer-events-none z-10 rounded-2xl border-gray-700"></div>
			<!-- Corner Status Tag (Bookmark) -->
			<div
				class="absolute top-3 -z-50 rounded-2xl text-sm font-bold select-none whitespace-nowrap border-2 shadow-md transition-all duration-300 border-gray-700 bg-gray-800"
				style="min-width: 90px; min-height: 60px; text-align: center"
			>
				<span class="font-bold text-base inline-block text-transparent">Loading</span>
			</div>
			<!-- CardContent -->
			<div class="relative z-30 p-4 space-y-4 flex-grow">
				<!-- Title -->
				<div class="flex justify-center items-center space-x-4 mb-1">
					<div class="h-7 w-40 bg-gray-700 rounded"></div>
					<div class="h-6 w-12 bg-gray-700 rounded"></div>
				</div>
				<!-- Module -->
				<div class="flex justify-center">
					<div class="h-5 w-32 bg-gray-700 rounded"></div>
				</div>
				<!-- Description -->
				<div class="flex justify-center">
					<div class="h-4 w-56 bg-gray-700 rounded"></div>
				</div>
				<!-- Break -->
				<hr class="m-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
				<div class="flex flex-col space-y-3 my-2">
					<div class="h-5 w-full bg-gray-700 rounded"></div>
					<div class="h-5 w-full bg-gray-700 rounded"></div>
					<div class="h-5 w-full bg-gray-700 rounded"></div>
					<div class="h-8 w-full bg-gray-700 rounded"></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{ count?: number }>();
</script>

<style></style>
