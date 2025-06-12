import type { ServerState } from '../types/instanceTypes';

const borderColor = (serverState: ServerState) => {
	// AMP (CubeCoders) style status colors
	switch (serverState) {
		case 'Running':
			return { border: 'border-emerald-500', bg: 'bg-emerald-500', meta: '#4CAF50' };
		case 'Stopped':
			return { border: 'border-gray-400', bg: 'bg-gray-400', meta: '#9E9E9E' };
		case 'Offline':
			return { border: 'border-gray-600', bg: 'bg-gray-600', meta: '#616161' };
		case 'PreStart':
			return { border: 'border-blue-500', bg: 'bg-blue-500', meta: '#2196F3' };
		case 'Starting':
			return { border: 'border-blue-500', bg: 'bg-blue-500', meta: '#2196F3' };
		case 'Updating':
			return { border: 'border-orange-500', bg: 'bg-orange-500', meta: '#FF9800' };
		case 'Stopping':
			return { border: 'border-amber-400', bg: 'bg-amber-400', meta: '#FFC107' };
		case 'Failed':
			return { border: 'border-red-500', bg: 'bg-red-500', meta: '#F44336' };
		default:
			return { border: 'border-gray-300', bg: 'bg-gray-300', meta: '#BDBDBD' };
	}
};

export default borderColor;
