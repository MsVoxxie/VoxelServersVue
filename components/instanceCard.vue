<template>
	<NuxtLink
		:to="`/servers/${instance.instanceId}`"
		class="instance-card group relative rounded-lg overflow-visible shadow-lg flex flex-col justify-between max-w-[425px] min-w-[350px] w-full hover:translate-y-1 transition-transform duration-200"
		:data-id="instance.instanceId"
	>
		<!-- Background Layer: Clipped Blur -->
		<div class="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none z-0">
			<!-- Solid background layer to hide tag borders -->
			<div class="absolute inset-0 bg-gray-900 rounded-2xl"></div>
			<img :src="instance.icon" class="w-full h-full object-cover filter blur-md" />
			<div class="absolute inset-0 bg-black/50"></div>
		</div>

		<!-- BorderStyling -->
		<div class="absolute inset-0 border-2 pointer-events-none z-10 rounded-2xl transition-colors" :class="borderColor(instance.server.state).border"></div>

		<!-- Corner Status Tag (Bookmark) -->
		<div
			class="absolute top-3 group-hover:-top-6 -z-50 rounded-2xl text-sm font-bold select-none whitespace-nowrap border-2 shadow-md transition-all duration-300"
			:class="[borderColor(instance.server.state).border, borderColor(instance.server.state).bg]"
			style="min-width: 90px; min-height: 60px; text-align: center"
		>
			<span class="font-bold text-base inline-block" style="filter: invert(1)">
				{{ instance.server.state }}
			</span>
		</div>

		<!-- CardContent -->
		<div class="relative z-30 p-4 space-y-4 flex-grow">
			<!-- Title -->
			<div class="text-white font-bold text-2xl text-center flex justify-center items-center leading-tight space-x-4 mb-1">
				<span>{{ instance.friendlyName || instance.instanceName }}</span>

				<!-- Modpack Link -->
				<a
					v-if="isMinecraftInstance(instance) && instance.welcomeMessage"
					:href="instance.welcomeMessage"
					target="_blank"
					rel="noopener"
					@click.stop
					class="inline-flex hover:translate-y-0.5 transition-transform duration-200"
				>
					<NuxtBadge trailing-icon="i-lucide-arrow-right" size="sm" color="primary" class="pt-0 pb-0 text-sm font-bold">Link</NuxtBadge>
				</a>
			</div>

			<!-- Module -->
			<div class="text-center text-md text-gray-300 p-0 m-0">
				<span>
					{{ instance.moduleName || instance.module }}
					<span v-if="instance.pack_version"> | Modpack {{ instance.pack_version }}</span>
				</span>
			</div>

			<!-- Description -->
			<div class="text-center text-sm">
				{{ instance.description || '' }}
			</div>

			<!-- Break -->
			<hr class="m-1 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

			<div class="justify-between items-center space-y-3 my-2">
				<ServerMeter :unit="instance.server.cpu.Units" :value="instance.server.cpu.RawValue" :maxValue="instance.server.cpu.MaxValue" title="CPU" color="#3B82F6" />
				<ServerMeter
					:unit="instance.server.memory.Units"
					:value="instance.server.memory.RawValue"
					:maxValue="instance.server.memory.MaxValue"
					title="Memory"
					color="#10B981"
				/>
				<ServerMeter
					v-if="instance.server.performance"
					:unit="instance.server.performance.Units"
					:value="instance.server.performance.RawValue"
					:maxValue="instance.server.performance.MaxValue"
					title="Performance"
					color="#F59E42"
				/>
				<PlayerCount
					:module="instance.module"
					:serverState="instance.server.state"
					:players="instance.players"
					:maxPlayers="instance.server.users.MaxValue"
					:currentPlayers="instance.server.users.RawValue"
					:percent="instance.server.users.Percent"
				/>
				<ServerConnection :server-state="instance.server.state" :ip="instance.server.ip" :port="instance.server.port" />
			</div>
		</div>
	</NuxtLink>
</template>

<script setup lang="ts">
import type { Instance } from '~/types/instanceTypes';
import borderColor from '~/utils/stateColor';

const props = defineProps<{
	instance: Instance;
}>();

const isMinecraftInstance = (instance: Instance): Boolean => instance.module === 'Minecraft';
</script>

<style></style>
