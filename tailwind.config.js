module.exports = {
	content: ['./components/**/*.{vue,js,ts}', './layouts/**/*.vue', './pages/**/*.vue', './app.vue'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				vx_dark: '#2e2e2e',
				vx_accent: '#653837',
				vx_accent2: '#887067',
				vx_light: '#ccb6b0',
				vx_pale: '#d5d5d5',
			},
			fontFamily: {
				pixel: ['"Press Start 2P"', 'monospace'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
