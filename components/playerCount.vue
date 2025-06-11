<script setup lang="ts">
defineProps<{
	players: number;
  maxPlayers: number;
}>();
</script>

<template>
<div>{{ players }} / {{ maxPlayers }} players</div>
</template>