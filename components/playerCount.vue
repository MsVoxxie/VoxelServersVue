<script setup lang="ts">
import fetchMCHead from '~/utils/fetchMCHead';

const props = defineProps<{
	module: string;
	serverState: string;
	players?: { name: string }[];
	maxPlayers: number;
	currentPlayers: number;
	percent?: number;
}>();
</script>

<template>
	<div>
		<div class="mb-1 flex justify-between text-sm font-medium text-white">
			<span>Players</span>
			<span>{{ currentPlayers }} / {{ maxPlayers }}</span>
		</div>
		<!-- Minecraft: Show heads -->
		<div v-if="props.module === 'Minecraft'">
			<div class="players-container grid grid-cols-10 gap-2 justify-center mt-1">
				<template v-for="i in props.maxPlayers" :key="i">
					<div v-if="props.serverState === 'Running' && props.players && props.players[i - 1]">
						<img
							:src="fetchMCHead(props.players[i - 1].name)"
							:alt="props.players[i - 1].name"
							:title="props.players[i - 1].name"
							class="w-6 h-6 rounded-full bg-gray-700 object-cover"
						/>
					</div>
					<div v-else class="w-6 h-6 rounded-full bg-gray-600/30"></div>
				</template>
			</div>
		</div>
		<!-- Other modules: Show bar -->
		<div v-else>
			<div class="w-full bg-gray-700 rounded-full h-2 mt-1 users-bar overflow-hidden">
				<div class="bg-purple-500 h-2 rounded-full transition-all duration-1000" :style="{ width: `${props.serverState === 'Running' ? props.percent ?? 0 : 0}%` }"></div>
			</div>
		</div>
	</div>
</template>
