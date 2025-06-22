<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import type { InstancesResponse } from '../../types/servers/instanceTypes';
import BoilerCard from '~/components/servers/boilerCard.vue';
import borderColor from '~/utils/servers/stateColor';
import FullInstance from '~/components/servers/fullInstance.vue';
import type { NetworkData } from '~/types/servers/networkTypes';

// definePageMeta({
// 	layout: 'servers-nav-header',
// });

const route = useRoute();
const config = useRuntimeConfig();
const instanceUrl = `${config.public.baseApiURI}/server/data/instances`;
const networkUrl = `${config.public.baseApiURI}/server/network`;
const isLoading = ref(true);

const { data, pending, refresh } = useAsyncData<InstancesResponse>('instance', () => $fetch(`${instanceUrl}/${route.params.id}`));
const { data: networkData, pending: networkPending, refresh: networkRefresh } = useAsyncData<NetworkData>('network', () => $fetch(`${networkUrl}`));

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

let instanceIntervalId: ReturnType<typeof setInterval> | undefined;
let networkIntervalId: ReturnType<typeof setInterval> | undefined;

const instances = computed(() => {
	const arr = data.value?.instances ?? [];
	return arr.filter((instance) => !instance.suspended);
});

onMounted(() => {
	refresh();
	networkRefresh();
	instanceIntervalId = setInterval(refresh, 2500);
	networkIntervalId = setInterval(networkRefresh, 2500);
});

onUnmounted(() => {
	if (instanceIntervalId) clearInterval(instanceIntervalId);
	if (networkIntervalId) clearInterval(networkIntervalId);
});

const instance = computed(() => instances.value[0]);

watch(
	instance,
	(val) => {
		useHead({
			title: `VoxelServers | ${val?.friendlyName || 'Loading'}`,
			meta: [
				{
					name: 'description',
					content: `${val?.friendlyName || 'Loading'} Status page.`,
				},
				{
					name: 'twitter:image',
					content: val?.icon || '/img/SrvLogoAlt.png',
				},
				{
					name: 'theme-color',
					content: `${borderColor(val?.server.state ?? 'Offline').meta || '#d5d5d5'}`,
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
				<div :key="isLoading || !instances.length ? 'loading' : 'loaded'">
					<div v-if="isLoading || !instances.length">
						<BoilerCard :count="1" />
					</div>
					<div v-else class="page-wrapper flex flex-col justify-center items-center py-6 px-8" style="min-height: calc(100vh - 2.5rem)">
						<div class="flex flex-wrap gap-8 max-w-screen-xl w-full justify-center">
							<FullInstance v-if="instance && networkData" :instance="instance" :linkStatus="instance.linkStatus" :network="networkData" />
							<!-- <InstanceCard v-for="instance in instances" :key="instance.instanceId" :instance="instance" /> -->
						</div>
					</div>
				</div>
			</transition>
		</client-only>
	</div>
</template>
