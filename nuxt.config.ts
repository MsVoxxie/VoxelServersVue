// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	runtimeConfig: {
		authSecret: process.env.AUTH_SECRET,
		botSecret: process.env.DISCORD_BOT_TOKEN,
		apiSecret: process.env.API_SECRET,
		public: {
			baseApiURI: 'https://vsb.voxxie.me/v1',
			voxelGuild: '997533753087889500',
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
	auth: {
		baseURL: `${process.env.NUXT_AUTH_ORIGIN}/api/auth`,
		provider: {
			type: 'authjs',
			trustHost: false,
			defaultProvider: 'discord',
			addDefaultCallbackUrl: '/',
		},
	},
	modules: [
		'@nuxt/eslint',
		'@nuxt/fonts',
		'@nuxt/icon',
		'@nuxt/scripts',
		'@nuxt/ui',
		'@hypernym/nuxt-anime',
		'nuxt-lucide-icons',
		'@nuxtjs/tailwindcss',
		'@sidebase/nuxt-auth',
	],
	css: ['~/assets/css/main.css'],
});
