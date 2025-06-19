<template>
	<div class="flex items-center gap-2">
		<img v-if="headUrl" :src="headUrl" :alt="player.name" class="w-6 h-6 rounded-full object-cover" />
		<div v-else class="w-6 h-6 rounded-full bg-gray-600/30"></div>
		<span class="text-white text-sm font-medium">{{ player.name }}</span>
	</div>
</template>

<script setup lang="ts">
import fetchMCHead from '~/utils/servers/fetchMCHead';
import fetchSteamHead from '~/utils/servers/fetchSteamHead';

const supportedGames = [
	{ name: 'minecraft', module: 'minecraft' },
	{ name: 'seven days to die', module: 'steam' },
];

const props = defineProps<{
	player: { name: string; uuid?: string };
	module?: string;
	moduleName?: string | null;
}>();

const gameModule = (props.moduleName || props.module || '').trim().toLowerCase();

function getPlayerHeadUrl(player: { name: string; uuid?: string }) {
	const game = supportedGames.find((g) => g.name === gameModule || g.module === gameModule);
	if (!game) return undefined;

	if (game.module === 'minecraft') {
		return fetchMCHead(player.name);
	}
	if (game.module === 'steam' && player.uuid && player.uuid.startsWith('Steam_')) {
		const steam64 = player.uuid.replace(/^Steam_/, '');
		return fetchSteamHead(steam64);
	}
	return undefined;
}

const headUrl = getPlayerHeadUrl(props.player);
</script>
