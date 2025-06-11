<script setup lang="ts">
import type { ServerState } from './types/instances';
import type { Instance } from './types/instances';
import getInstances from './utils/useInstances';

const { data } = await useAsyncData('instances', getInstances);
const isMinecraftInstance = (instance: Instance): Boolean => instance.module === 'Minecraft';

const borderColor = (serverState: ServerState) => {
	switch (serverState) {
		case 'PreStart':
			return 'border-gray-500';
		case 'Starting':
			return 'border-yellow-500';
		case 'Started':
			return 'border-green-500';
		case 'Updating':
			return 'border-blue-500';
		case 'Stopping':
			return 'border-orange-500';
		case 'Stopped':
			return 'border-red-500';
		case 'Offline':
			return 'border-gray-700';
		case 'Errored':
			return 'border-red-800';
		default:
			return 'border-gray-300';
	}
};
</script>
<template>
	<NuxtApp>
		<div class="page-wrapper min-h-screen flex flex-col justify-center items-center py-6 px-8">
			<!-- Community Badge -->
			<a class="text-center text-white font-bold text-3xl mb-6 transition hover:shadow-2xl hover:-translate-y-1" href="/v1/servers">VoxelServers</a>

			<!-- Instances Grid -->
			<div class="flex flex-wrap gap-6 max-w-screen-xl w-full justify-center">
				<div
					class="instance-card relative rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between max-w-[340px] w-full"
					v-for="instance in data?.instances"
					:key="instance.instanceId"
					:data-id="instance.instanceId"
				>
					<!-- BorderStyling -->
					<div class="absolute inset-0">
						<img :src="instance.icon" class="w-full h-full object-cover filter blur-md opacity-80" />
						<div class="absolute inset-0 bg-black/50"></div>
					</div>

					<!-- IndicatorBorder -->
					<div class="absolute inset-0 border-2 rounded-2xl pointer-events-none" :class="borderColor(instance.server.state)"></div>

					<!-- CardContent -->
					<div class="relative z-10 p-4 space-y-2 flex-grow">
						<!-- Title -->
						<div class="text-white font-bold text-xl text-center flex justify-center items-center leading-tight space-x-2">
							<span>{{ instance.friendlyName || instance.instanceName }}</span>

							<!-- Modpack Link -->
							<a
								v-if="isMinecraftInstance(instance) && instance.welcomeMessage"
								:href="instance.welcomeMessage"
								target="_blank"
								rel="noopener"
								@click.stop
								class="inline-flex"
							>
								<NuxtBadge trailing-icon="i-lucide-arrow-right" size="md" color="primary" class="cursor-pointer"> Modpack </NuxtBadge>
							</a>
						</div>

						<div>
							<ServerMeter :value="instance.server.cpu.RawValue" :maxValue="instance.server.cpu.MaxValue" title="CPU" color="#3B82F6" />
							<ServerMeter :value="instance.server.memory.RawValue" :maxValue="instance.server.memory.MaxValue" title="Memory" color="#10B981" />
							<ServerMeter v-if="isMinecraftInstance(instance)" :value="instance.server.performance.RawValue" :maxValue="instance.server.performance.MaxValue" title="Performance" color="#F59E42" />
							<PlayerCount v-if="isMinecraftInstance(instance)" :players="instance.server.users?.RawValue" :maxPlayers="instance.server.users?.MaxValue" />
							<ServerStatus :state="instance.server.state" />
							<ServerAddress v-if="isMinecraftInstance(instance)" :ip="instance.server.ip" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</NuxtApp>
</template>
