import type { ServerState } from '../types/instanceTypes';

const borderColor = (serverState: ServerState) => {
	switch (serverState) {
		case 'Running':
			return { border: 'border-emerald-600', bg: 'bg-emerald-600' }; // Healthy green
		case 'Stopped':
			return { border: 'border-neutral-500', bg: 'bg-neutral-500' }; // Neutral gray
		case 'Offline':
			return { border: 'border-gray-700', bg: 'bg-gray-700' }; // Dark gray for offline
		case 'PreStart':
			return { border: 'border-sky-700', bg: 'bg-sky-700' }; // Calm blue
		case 'Starting':
			return { border: 'border-amber-700', bg: 'bg-amber-700' }; // Amber for starting
		case 'Updating':
			return { border: 'border-blue-800', bg: 'bg-blue-800' }; // Deep blue for updating
		case 'Stopping':
			return { border: 'border-yellow-800', bg: 'bg-yellow-800' }; // Muted yellow
		case 'Failed':
			return { border: 'border-red-700', bg: 'bg-red-700' }; // Red for error
		default:
			return { border: 'border-slate-600', bg: 'bg-slate-600' }; // Default muted slate
	}
};

export default borderColor;
