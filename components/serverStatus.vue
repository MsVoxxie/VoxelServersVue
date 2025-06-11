<script setup lang="ts">
import type { ServerState } from '~/types/instanceTypes';

defineProps<{
	state: ServerState;
}>();
</script>

<template>
	<div>
		<span>Status</span>
		<span>{{ state }}</span>
	</div>
</template>
