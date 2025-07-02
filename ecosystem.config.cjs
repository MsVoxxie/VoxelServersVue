module.exports = {
	apps: [
		{
			name: 'VoxelVue',
			port: '2001',
			script: './.output/server/index.mjs',
			watch: ['.output'],
		},
		{
			name: 'VoxelVue WebSocket',
			script: './server/ws-runner.js',
			instances: 1,
			watch: false,
			wait_ready: true,
			autorestart: true,
			env_file: '.env',
			env: {
				NODE_ENV: 'production'
			}
		},
	],
};
