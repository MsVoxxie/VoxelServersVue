<script setup lang="ts">
import fetchMCHead from '~/utils/servers/fetchMCHead';
import fetchSteamHead from '~/utils/servers/fetchSteamHead';

const supportedGames = ['minecraft', 'seven days to die'];

const props = defineProps<{
	module?: string;
	moduleName?: string | null;
	serverState: string;
	players?: { name: string; uuid?: string }[];
	maxPlayers: number;
	currentPlayers: number;
	percent?: number;
}>();

const gameModule = (props.moduleName || props.module || '').trim().toLowerCase();

function getPlayerHeadUrl(player: { name: string; uuid?: string }) {
	if (gameModule === 'minecraft') {
		return fetchMCHead(player.name);
	}
	if (gameModule === 'seven days to die' && player.uuid && player.uuid.startsWith('Steam_')) {
		const steam64 = player.uuid.replace(/^Steam_/, '');
		return fetchSteamHead(steam64);
	}
	return undefined;
}
</script>

<template>
	<div>
		<div class="mb-1 flex justify-between text-sm font-medium text-white">
			<span>Players</span>
			<span>{{ currentPlayers }} / {{ maxPlayers }}</span>
		</div>
		<!-- Supported games: Show heads -->
		<div v-if="supportedGames.includes(gameModule)">
			<div class="players-container grid grid-cols-10 gap-2 justify-center mt-1 mb-4">
				<template v-for="i in maxPlayers" :key="i">
					<div>
						<transition name="head-pop" mode="out-in">
							<img
								v-if="serverState === 'Running' && players && players[i - 1] && getPlayerHeadUrl(players[i - 1])"
								:src="getPlayerHeadUrl(players[i - 1])"
								:title="players[i - 1].name"
								class="w-6 h-6 rounded-full object-cover"
								:key="players[i - 1]?.uuid || players[i - 1]?.name"
							/>
							<div v-else class="w-6 h-6 rounded-full bg-gray-600/30" :key="'empty-' + i"></div>
						</transition>
					</div>
				</template>
			</div>
		</div>
		<!-- Other modules: Show bar -->
		<div v-else>
			<div class="w-full bg-gray-700 rounded-full h-2 mt-1 users-bar overflow-hidden mb-4">
				<div class="bg-purple-500 h-2 rounded-full transition-all duration-1000" :style="{ width: `${serverState === 'Running' ? percent ?? 0 : 0}%` }"></div>
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
