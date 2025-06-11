<script setup lang="ts">
defineProps<{
	playerAvatarUri?: string;
	playerDisplayName?: string;
}>();
</script>
<template>
  <NuxtAvatar :src="playerAvatarUri" :title="playerDisplayName" />
</template>
