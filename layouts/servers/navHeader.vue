<template>
	<header
		class="fixed z-50 max-w-md bg-black/70 backdrop-blur-lg shadow-lg rounded-xl border-2 border-white px-2 py-1 flex items-center gap-2 transition-all duration-300 [transform-origin:top_left] sm:rotate-0 rotate-90 sm:top-4 sm:left-4 -top-4 left-4"
		:class="{
			'rotate-90 -top-4 left-4': isVertical,
			'rotate-0 top-4 left-15': !isVertical,
		}"
		:style="{ opacity: opacity }"
	>
		<!-- Avatar or login button -->
		<div class="flex items-center justify-center flex-shrink-0">
			<div v-if="user" class="relative w-8 h-8 group cursor-pointer" @click="logout" title="Log out">
				<img
					:src="user.image"
					:alt="user.name"
					class="absolute inset-0 w-8 h-8 rounded-full border border-white shadow object-cover transition-all duration-500 group-hover:opacity-0 group-hover:rotate-180"
					v-if="user.image"
				/>
				<span class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
					<LucideLogOut class="w-7 h-7 text-red-400 bg-white/80 rounded-full p-1" />
				</span>
			</div>
			<button
				v-else
				type="button"
				@click="loginWithDiscord"
				class="flex items-center group bg-white/10 hover:bg-white/20 border border-white/20 rounded-full p-1 shadow transition"
				title="Sign in with Discord"
				@mouseenter="discordHover = true"
				@mouseleave="discordHover = false"
			>
				<img :src="discordHover ? discordIcon : '/img/VS_Fox.png'" class="w-7 h-7 object-contain transition-all duration-200" aria-hidden="true" />
			</button>
		</div>
		<!-- Welcome text and username -->
		<div class="flex flex-col sm:flex-row sm:items-center flex-1 min-w-0">
			<span class="text-white text-base font-bold leading-tight whitespace-nowrap">
				<span v-if="user">
					Welcome back, <span class="text-primary-400">{{ user.name.charAt(0).toUpperCase() + user.name.slice(1) }}</span>
				</span>
				<span v-else> Welcome to <span class="text-primary-400">VoxelServers</span> </span>
			</span>
		</div>
	</header>
	<main class="pt-8">
		<slot />
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { LucideLogOut } from 'lucide-vue-next';
import { siDiscord } from 'simple-icons';
const { signIn, signOut, data } = useAuth();
function loginWithDiscord() {
	signIn('discord', { callbackUrl: window.location.pathname });
}
function logout() {
	signOut({ callbackUrl: window.location.pathname });
}

const opacity = ref(1);
const discordHover = ref(false);

interface CustomUser {
	name: string;
	image: string;
	id?: string;
	guilds?: any[];
}

const user = computed(() => data.value?.user as CustomUser | undefined);

const discordIcon = 'data:image/svg+xml;utf8,' + encodeURIComponent(siDiscord.svg.replace(/fill="[^"]*"/g, 'fill="#5865F2"'));

const isVertical = ref(false);
const handleResize = () => {
	isVertical.value = window.innerWidth < 400;

	if (window.innerWidth < 575) {
		opacity.value = 0;
	} else {
		opacity.value = 1;
	}
};
onMounted(() => {
	window.addEventListener('resize', handleResize);
	handleResize();
});
onUnmounted(() => {
	window.removeEventListener('resize', handleResize);
});
</script>
