// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-05-15',
	devtools: { enabled: true },
	runtimeConfig: {
		authSecret: '0yjQik5YGzzJWU/itp+sEj2yH3pxXCBHrtFqvg4aiubZft+enBoJI1tF3AE=',
		public: {
			instanceURI: 'https://vsb.voxxie.me/v1/server/data/instances',
			mcHeadsURI: 'https://vsb.voxxie.me/v1/client/playerheads',
			steamHeadsURI: 'https://vsb.voxxie.me/v1/client/steamheads',
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
