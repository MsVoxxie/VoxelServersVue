<script setup lang="ts">
const { throbberState } = useThrobber();
</script>

<template>
	<transition name="fade">
		<div v-if="throbberState.value" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 blur-fade">
			<span class="loader" />
		</div>
	</transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
.loader {
	width: 3rem;
	height: 3rem;
	border: 6px solid #fff3;
	border-top: 6px solid #38bdf8;
	border-radius: 50%;
	animation: spin 1s linear infinite;
	display: inline-block;
}
@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
