export type ServerState = 'PreStart' | 'Starting' | 'Running' | 'Updating' | 'Stopping' | 'Stopped' | 'Offline' | 'Failed';

export interface InstanceMetric {
	RawValue: number;
	MaxValue: number;
	Percent: number;
	Units: string;
	Color: string;
	Color2: string | null;
	Color3: string | null;
	ShortName: string | null;
	Unit?: string | null;
}

export interface ServerInfo {
	state: ServerState;
	cpu: InstanceMetric;
	memory: InstanceMetric;
	users: InstanceMetric;
	uptime: string;
	performance: InstanceMetric;
	ip: string;
	port: number;
	currentTime: null | {
		day: string;
		time: string;
	};
}

export interface Instance {
	instanceId: string;
	instanceName: string;
	friendlyName: string;
	welcomeMessage: string;
	description: string;
	releaseDate: string;
	running: boolean;
	module: string;
	moduleName: string | null;
	pack_version: string | null;
	icon: string;
	suspended: boolean;
	server: ServerInfo;
	players: Array<{ name: string; uuid: string }>;
	linkStatus: boolean;
}

export interface InstanceResponse {
	instance: Instance;
}

export interface InstancesResponse {
	instances: Instance[];
	[key: string]: any;
}
