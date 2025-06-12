module.exports = {
	apps: [
		{
			name: 'VoxelVue',
			port: '2001',
			script: './.output/server/index.mjs',
			watch: ['.output'],
		},
	],
};
