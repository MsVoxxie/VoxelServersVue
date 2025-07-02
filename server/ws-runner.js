#!/usr/bin/env node

// Load environment variables first
import { config } from 'dotenv';
config();

// Standalone WebSocket server runner
// This script imports and starts the WebSocket server as a standalone process
// to avoid any issues with module re-execution in Nuxt

import './ws.js';

console.log('WebSocket server process started');

// Keep the process alive
process.on('SIGINT', () => {
	console.log('WebSocket server shutting down...');
	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('WebSocket server shutting down...');
	process.exit(0);
});
