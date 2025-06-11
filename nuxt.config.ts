// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	runtimeConfig: {
		instanceURI: 'https://vsb.voxxie.me/v1/server/data/instances',
	},
	ui: {
		prefix: "Nuxt",
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/scripts',
		'@nuxt/ui',
		'@nuxtjs/tailwindcss',
	],
	css: ['~/assets/css/main.css']
});