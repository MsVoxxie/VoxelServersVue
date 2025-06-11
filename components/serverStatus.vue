<script setup lang="ts">
import type { ServerState } from '~/types/instances';

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
