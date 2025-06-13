<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { InstancesResponse } from '../../types/instanceTypes';

definePageMeta({
	layout: 'nav-header',
});

const config = useRuntimeConfig();
const baseUrl = config.public.instanceURI;
const data = ref<InstancesResponse | null>(null);
const pending = ref(true);
const isLoading = ref(true);

const fetchData = async () => {
	pending.value = true;
	data.value = await $fetch<InstancesResponse>(baseUrl);
	pending.value = false;
};

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
	fetchData();
	intervalId = setInterval(fetchData, 2500);
});

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId);
});

useHead({
	title: 'VoxelServers | Servers',
	meta: [
		{
			name: 'description',
			content: `All Servers Status page.`,
		},
		{
			name: 'twitter:image',
			content: '/img/SrvLogoAlt.png',
		},
		{
			name: 'theme-color',
			content: '#d5d5d5',
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
						<BoilerCard :count="4" />
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
