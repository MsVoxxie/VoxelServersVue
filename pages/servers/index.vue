<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { InstancesResponse } from '../../types/servers/instanceTypes';
import BoilerCard from '~/components/servers/boilerCard.vue';
import MultiInstanceRedesign from '~/components/servers/multiInstanceRedesign.vue';

const config = useRuntimeConfig();
const baseUrl = `${config.public.baseApiURI}/server/data/instances`;
const isLoading = ref(true);

const { data, pending, refresh } = useAsyncData<InstancesResponse>('instances', () => $fetch(`${baseUrl}`));

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
	intervalId = setInterval(refresh, 5 * 1000);
});

onUnmounted(() => {
	if (intervalId) clearInterval(intervalId);
});

watch(
	instances,
	(val) => {
		useHead({
			title: 'VoxelServers | Servers',
			meta: [
				{
					name: 'description',
					content: `Status page for ${val.length} servers.`,
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
	},
	{ immediate: true }
);
</script>
<template>
	<div>
		<client-only>
			<transition name="fade" mode="out-in">
				<div :key="isLoading ? 'loading' : 'loaded'">
					<div v-if="isLoading">
						<BoilerCard :count="4" />
					</div>
					<div v-else class="page-wrapper flex flex-col justify-center items-center py-6 px-8" style="min-height: calc(100vh - 2.5rem)">
						<div class="flex flex-wrap gap-8 max-w-screen-xl w-full justify-center">
							<MultiInstanceRedesign :instances="instances" />
						</div>
					</div>
				</div>
			</transition>
		</client-only>
	</div>
</template>
