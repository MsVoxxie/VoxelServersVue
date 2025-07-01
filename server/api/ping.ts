export default defineEventHandler(async (event) => {
	// Simple endpoint that returns immediately for ping testing
	return {
		timestamp: Date.now(),
		status: 'ok'
	};
});
