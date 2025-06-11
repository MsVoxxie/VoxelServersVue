<script setup lang="ts">
defineProps<{
	ip: string;
}>();

// Add copy to clipboard on click callback
</script>

<template>
<div>
  <span>Connect</span>
  <div>
    {{ ip }}
    <NuxtLink>Copy</NuxtLink>
  </div>
</div>
</template>