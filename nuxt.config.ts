// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			instanceURI: 'https://vsb.voxxie.me/v1/server/data/instances',
			mcHeadsURI: 'https://vsb.voxxie.me/v1/client/playerheads',
		},
	},
	ui: {
		prefix: 'Nuxt',
	},
	app: {
		pageTransition: { name: 'fade', mode: 'out-in' },
		head: {
			link: [{ rel: 'icon', type: 'image/x-icon', href: '/img/favicon.ico' }],
		},
	},
	modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxt/scripts', '@nuxt/ui', '@hypernym/nuxt-anime', 'nuxt-lucide-icons', '@nuxtjs/tailwindcss'],
	css: ['~/assets/css/main.css'],
});
