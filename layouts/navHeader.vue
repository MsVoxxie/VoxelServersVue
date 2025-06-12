<template>
	<header class="fixed top-0 left-0 w-full z-50 flex items-center h-10">
		<NuxtLink to="/servers" class="block w-full text-center text-white font-bold text-4xl bg-gradient-to-b from-black/80 to-transparent transition">
			<span class="pt-5 inline-block transition-transform duration-200 hover:translate-y-2"> VoxelServers </span>
		</NuxtLink>
	</header>
	<div class="pt-10">
		<slot />
	</div>
</template>
