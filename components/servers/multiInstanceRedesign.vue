<template>
	<div class="min-h-fit w-full bg-black/80 pt-20 rounded-2xl border-white/10 border-2 shadow-2xl sm:pt-4">
		<!-- Header Section -->
		<header class="w-full backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
			<div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
				<div class="flex items-center justify-between gap-4">
					<div>
						<h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">Voxelservers</h1>
						<span class="text-gray-400">Still a W.I.P 🙂</span>
					</div>

					<!-- Quick Stats -->
					<div class="flex gap-2 sm:gap-4 text-center">
						<div class="bg-gray-900/80 rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
							<div class="text-sm sm:text-xl font-bold text-green-400">{{ runningServers }}</div>
							<div class="text-xs text-gray-400">Running</div>
						</div>
						<div class="bg-gray-900/80 rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
							<div class="text-sm sm:text-xl font-bold text-blue-400">{{ totalPlayers }}</div>
							<div class="text-xs text-gray-400">Players</div>
						</div>
						<div class="bg-gray-900/80 rounded-xl px-2 sm:px-4 py-2 sm:py-3 border border-white/20">
							<div class="text-sm sm:text-xl font-bold text-white">{{ filteredInstances.length }}</div>
							<div class="text-xs text-gray-400">Total</div>
						</div>
					</div>
				</div>

				<!-- Filter and Search Bar -->
				<div class="mt-4 sm:mt-6 flex gap-3 sm:gap-4">
					<div class="flex-1 relative">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Search servers..."
							class="w-full bg-gray-900/80 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors"
						/>
						<Search class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
					</div>

					<div class="flex gap-2">
						<select
							v-model="selectedModule"
							class="bg-gray-900/80 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-w-0"
						>
							<option value="">All Games</option>
							<option v-for="module in uniqueModules" :key="module" :value="module">
								{{ module }}
							</option>
						</select>

						<select
							v-model="selectedStatus"
							class="bg-gray-900/80 border border-white/20 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors min-w-0"
						>
							<option value="">All Status</option>
							<option value="Running">Running</option>
							<option value="Starting">Starting</option>
							<option value="Stopped">Stopped</option>
							<option value="Offline">Offline</option>
							<option value="Suspended">Suspended</option>
						</select>
					</div>
				</div>
			</div>
		</header>

		<!-- Main Content -->
		<main class="w-full px-4 sm:px-6 py-6 sm:py-8">
			<div class="max-w-7xl mx-auto bg-black/50 border-white/10 border-2 rounded-2xl shadow-2xl p-6 overflow-hidden">
				<!-- Loading State -->
				<div v-if="loading" class="flex items-center justify-center py-20">
					<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
					<span class="ml-3 text-white">Loading servers...</span>
				</div>

				<!-- Empty State -->
				<div v-else-if="filteredInstances.length === 0 && !loading" class="text-center py-20">
					<div class="text-6xl text-gray-600 mb-4">😖</div>
					<h3 class="text-2xl font-bold text-white mb-2">No servers found</h3>
					<p class="text-gray-400 mb-6">
						{{ searchQuery || selectedModule || selectedStatus ? 'Try adjusting your filters or search query.' : 'Add a new server to get started!' }}
					</p>
					<button v-if="!searchQuery && !selectedModule && !selectedStatus" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors">
						Add Your First Server
					</button>
				</div>

				<!-- List View -->
				<div v-else class="max-h-96 overflow-y-auto">
					<div class="space-y-4">
						<TransitionGroup name="slide" tag="div" class="space-y-4">
							<div
								v-for="instance in filteredInstances"
								:key="instance.instanceId"
								class="bg-black/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-white/30 transition-all duration-200 shadow-2xl"
							>
								<NuxtLink :to="`/servers/${instance.instanceId}`" class="flex items-center gap-6 group">
									<!-- Server Icon -->
									<div class="flex-shrink-0">
										<img
											:src="instance.icon"
											:alt="instance.friendlyName || instance.instanceName"
											class="w-45 rounded-lg object-cover border-2 border-white/20 bg-gray-900"
										/>
									</div>

									<!-- Server Info -->
									<div class="flex-grow min-w-0">
										<div class="flex items-center gap-3 mb-2">
											<h3 class="text-xl font-bold text-white truncate group-hover:text-blue-400 transition-colors">
												{{ instance.friendlyName || instance.instanceName }}
											</h3>
											<span class="px-3 py-1 rounded-full text-xs font-semibold" :class="borderColor(instance.server.state).bg">
												{{ instance.server.state }}
											</span>
										</div>
										<div class="text-gray-300 text-sm mb-2">
											{{ instance.moduleName || instance.module }}
											<span v-if="instance.pack_version" class="text-gray-400"> | Modpack {{ instance.pack_version }} </span>
										</div>
										<p class="text-gray-400 text-sm truncate">
											{{ instance.description || 'No description available' }}
										</p>
									</div>

									<!-- Server Stats -->
									<div class="hidden md:flex items-center gap-6 text-center">
										<div>
											<div class="text-lg font-bold text-white">{{ instance.server.users?.RawValue || 0 }}/{{ instance.server.users?.MaxValue || 0 }}</div>
											<div class="text-xs text-gray-400">Players</div>
										</div>
										<div>
											<div class="text-lg font-bold text-blue-400">{{ Math.round(instance.server.cpu?.RawValue || 0) }}%</div>
											<div class="text-xs text-gray-400">CPU</div>
										</div>
										<div>
											<div class="text-lg font-bold text-green-400">{{ ((instance.server.memory?.RawValue || 0) / 1024).toFixed(1) }}GB</div>
											<div class="text-xs text-gray-400">Memory</div>
										</div>
									</div>

									<!-- Arrow -->
									<div class="flex-shrink-0 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
										<ChevronRight class="w-5 h-5" />
									</div>
								</NuxtLink>
							</div>
						</TransitionGroup>
					</div>
				</div>
			</div>
		</main>
	</div>
</template>

<script setup lang="ts">
import type { Instance } from '~/types/servers/instanceTypes';
import borderColor from '~/utils/servers/stateColor';
import { ref, computed, onMounted, watch } from 'vue';
import { Search, ChevronRight } from 'lucide-vue-next';

// Props
const props = defineProps<{
	instances?: Instance[];
}>();

// Reactive data
const loading = ref(true);
const instances = ref<Instance[]>(props.instances || []);
const searchQuery = ref('');
const selectedModule = ref('');
const selectedStatus = ref('');

// Computed properties
const filteredInstances = computed(() => {
	let filtered = instances.value;

	// Filter by search query
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase();
		filtered = filtered.filter(
			(instance) =>
				(instance.friendlyName || instance.instanceName).toLowerCase().includes(query) ||
				(instance.description || '').toLowerCase().includes(query) ||
				(instance.moduleName || instance.module || '').toLowerCase().includes(query)
		);
	}

	// Filter by module
	if (selectedModule.value) {
		filtered = filtered.filter((instance) => (instance.moduleName || instance.module) === selectedModule.value);
	}

	// Filter by status
	if (selectedStatus.value) {
		filtered = filtered.filter((instance) => instance.server.state === selectedStatus.value);
	}

	// Sort by status priority: Running first, then others
	return filtered.sort((a, b) => {
		const statusPriority: Record<string, number> = {
			Running: 0,
			Starting: 1,
			Stopping: 2,
			Stopped: 3,
			Offline: 4,
			Suspended: 5,
		};

		const aPriority = statusPriority[a.server.state] ?? 6;
		const bPriority = statusPriority[b.server.state] ?? 6;

		if (aPriority !== bPriority) {
			return aPriority - bPriority;
		}

		// If same status, sort alphabetically by name
		const aName = a.friendlyName || a.instanceName;
		const bName = b.friendlyName || b.instanceName;
		return aName.localeCompare(bName);
	});
});

const uniqueModules = computed(() => {
	const modules = instances.value.map((instance) => instance.moduleName || instance.module || 'Unknown');
	return [...new Set(modules)].sort();
});

const runningServers = computed(() => {
	return instances.value.filter((instance) => instance.server.state === 'Running').length;
});

const totalPlayers = computed(() => {
	return instances.value.reduce((total, instance) => {
		return total + (instance.server.users?.RawValue || 0);
	}, 0);
});

// Methods - No longer needed since we only have list view

// Watch for prop changes
watch(
	() => props.instances,
	(newInstances) => {
		if (newInstances) {
			instances.value = newInstances;
		}
	},
	{ immediate: true }
);

// Lifecycle
onMounted(async () => {
	// If no instances prop provided, you can fetch here
	if (!props.instances) {
		try {
			// TODO: Replace with your actual data fetching logic
			// const fetchedInstances = await $fetch('/api/instances');
			// instances.value = fetchedInstances;

			// For now, simulate loading delay
			await new Promise((resolve) => setTimeout(resolve, 1000));
		} catch (error) {
			console.error('Failed to fetch instances:', error);
		}
	}

	loading.value = false;
});
</script>

<style scoped>
/* Prevent horizontal overflow */
* {
	box-sizing: border-box;
}

.container {
	max-width: 100%;
	overflow-x: hidden;
}

/* Slide transition for list items */
.slide-enter-active,
.slide-leave-active {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
	opacity: 0;
	transform: translateX(-40px);
}

.slide-leave-to {
	opacity: 0;
	transform: translateX(40px);
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
	width: 8px;
}

::-webkit-scrollbar-track {
	background: rgba(0, 0, 0, 0.1);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.2);
	border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.3);
}

/* Smooth scroll behavior */
html {
	scroll-behavior: smooth;
}

/* Focus styles for accessibility */
input:focus,
select:focus,
button:focus {
	outline: 2px solid #3b82f6;
	outline-offset: 2px;
}

/* Animation for loading spinner */
@keyframes spin {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.animate-spin {
	animation: spin 1s linear infinite;
}

/* Hover effects */
.hover-lift:hover {
	transform: translateY(-4px);
}

/* Backdrop blur support */
@supports (backdrop-filter: blur(12px)) {
	.backdrop-blur-sm {
		backdrop-filter: blur(12px);
	}
}

/* Responsive grid improvements */
@media (max-width: 768px) {
	.grid {
		gap: 1rem;
	}

	/* Adjust for nav header on mobile */
	.min-h-screen {
		min-height: calc(100vh - 5rem);
	}
}

/* Mobile-specific adjustments */
@media (max-width: 640px) {
	/* Reduce padding on mobile */
	.max-w-7xl {
		padding-left: 1rem;
		padding-right: 1rem;
	}

	/* Stack filter controls on very small screens */
	.flex-wrap > * {
		min-width: 120px;
	}
}

/* List view specific styles */
.list-view-item {
	backdrop-filter: blur(12px);
	background: rgba(0, 0, 0, 0.8);
	border: 1px solid rgba(255, 255, 255, 0.2);
}

.list-view-item:hover {
	border-color: rgba(255, 255, 255, 0.3);
	background: rgba(0, 0, 0, 0.9);
}

/* Search and filter enhancements */
.search-input {
	background: rgba(31, 41, 55, 0.8); /* gray-900/80 equivalent */
	transition: all 0.2s ease;
}

.search-input:focus {
	background: rgba(31, 41, 55, 1);
	box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Header sticky positioning fixes */
header {
	will-change: transform;
}

/* Prevent layout shift on mobile */
@media (max-width: 575px) {
	.pt-20 {
		padding-top: 1rem;
	}
}

/* Ensure proper spacing for nav header without excessive gap */
@media (min-width: 640px) {
	.pt-20 {
		padding-top: 1rem;
	}

	/* No extra padding needed - let the container handle centering */
}
</style>
