<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { InstancesResponse } from '../../types/instanceTypes';
import borderColor from '~/utils/stateColor';

definePageMeta({
	layout: 'nav-header',
});

const route = useRoute();
const config = useRuntimeConfig();
const baseUrl = config.public.instanceURI;
const isLoading = ref(true);

const { data, pending, refresh } = await useAsyncData<InstancesResponse>('instance', () => $fetch(`${baseUrl}/${route.params.id}`));

watch(
	() => pending.value,
	(isPending) => {
		if (isLoading.value && !isPending) {
			setTimeout(() => {
				isLoading.value = false;
			}, 500);
		}
		if (isLoading.value && isPending) {
		}
	},
	{ immediate: true }
);

let intervalId: ReturnType<typeof setInterval> | undefined;

const instances = computed(() => {
	const arr = data.value?.instances ?? [];
	return arr.filter((instance) => !instance.suspended);
});

onMounted(() => {
	refresh();
	intervalId = setInterval(refresh, 2500);
});

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId);
});

const instance = computed(() => instances.value[0]);

useHead({
	title: `VoxelServers | ${instance.value?.friendlyName || 'Loading'}`,
	meta: [
		{
			name: 'description',
			content: `${instance.value?.friendlyName || 'Loading'} Status page.`,
		},
		{
			name: 'twitter:image',
			content: instance.value?.icon || '/img/SrvLogoAlt.png',
		},
		{
			name: 'theme-color',
			content: `${borderColor(instance.value?.server.state ?? 'Offline').meta || '#d5d5d5'}`,
		},
	],
});
</script>
<template>
	<div>
		<client-only>
			<transition name="fade" mode="out-in">
				<div :key="isLoading || !instances.length ? 'loading' : 'loaded'">
					<div v-if="isLoading || !instances.length">
						<BoilerCard :count="1" />
					</div>
					<div v-else class="page-wrapper flex flex-col justify-center items-center py-6 px-8" style="min-height: calc(100vh - 2.5rem)">
						<div class="flex flex-wrap gap-8 max-w-screen-xl w-full justify-center">
							<InstanceCard v-for="instance in instances" :key="instance.instanceId" :instance="instance" />
						</div>
					</div>
				</div>
			</transition>
		</client-only>
	</div>
</template>
