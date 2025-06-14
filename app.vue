<script setup lang="ts">
import FullPageLoad from './components/servers/fullPageLoad.vue';
import WaveBackground from './components/servers/waveBackground.vue';
</script>

<template>
	<FullPageLoad />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<WaveBackground v-if="$route.path.startsWith('/servers')" />
</template>
