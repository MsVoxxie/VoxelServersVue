import { useThrobber } from '#imports';

export default defineNuxtPlugin((nuxtApp) => {
	const { showThrobber, hideThrobber } = useThrobber();

	nuxtApp.hook('page:start', () => {
		showThrobber();
	});

	nuxtApp.hook('page:finish', () => {
		hideThrobber();
	});
});
