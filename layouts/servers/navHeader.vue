<template>
	<header class="fixed top-0 left-0 z-50 bg-[var(--vx_primary)] shadow-lg border-r-2 border-b-2 rounded-br-2xl" :style="{ opacity: opacity }">
		<div class="max-w-10xl mx-auto flex items-center h-9 px-5">
			<NuxtLink to="/servers" class="flex items-center gap-2 font-bold text-2xl hover:text-dimmed transition group" title="Go to Servers">
				<img src="/assets/img/VS_Fox.png" alt="VoxelServers Fox Logo" class="w-6 h-6 object-contain" aria-hidden="true" />
				<span>VoxelServers</span>
			</NuxtLink>
			<nav class="ml-auto flex gap-6">
				<!-- Add content here later -->
			</nav>
		</div>
	</header>
	<main class="pt-10">
		<slot />
	</main>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
const opacity = ref(1);

const handleScroll = () => {
	// Fade out after 40px, fully hidden at 120px
	const y = window.scrollY;
	opacity.value = y < 40 ? 1 : y > 120 ? 0 : 1 - (y - 40) / 80;
};

onMounted(() => {
	window.addEventListener('scroll', handleScroll);
});
onUnmounted(() => {
	window.removeEventListener('scroll', handleScroll);
});
</script>
