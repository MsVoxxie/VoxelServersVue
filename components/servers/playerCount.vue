<script setup lang="ts">
import fetchMCHead from '~/utils/servers/fetchMCHead';

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
					<div>
						<transition name="head-pop" mode="out-in">
							<img
								v-if="props.serverState === 'Running' && props.players && props.players[i - 1]"
								:src="fetchMCHead(props.players[i - 1].name)"
								:alt="props.players[i - 1].name"
								:title="props.players[i - 1].name"
								class="w-6 h-6 rounded-full object-cover"
								:key="props.players[i - 1]?.name"
							/>
							<div v-else class="w-6 h-6 rounded-full bg-gray-600/30" :key="'empty-' + i"></div>
						</transition>
					</div>
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

<style scoped>
.head-pop-enter-from,
.head-pop-leave-to {
	transform: scale(0.5);
	opacity: 0;
}
.head-pop-enter-active,
.head-pop-leave-active {
	transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.head-pop-enter-to,
.head-pop-leave-from {
	transform: scale(1);
	opacity: 1;
}
</style>
