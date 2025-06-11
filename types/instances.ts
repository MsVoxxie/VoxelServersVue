export type ServerState = 'PreStart' | 'Starting' | 'Started' | 'Updating' | 'Stopping' | 'Stopped' | 'Offline' | 'Errored';

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
	players?: any[];
}

export interface Instance {
	instanceId: string;
	instanceName: string;
	friendlyName: string;
	welcomeMessage: string;
	description: string;
	running: boolean;
	module: string;
	moduleName: string | null;
	pack_version: string | null;
	icon: string;
	suspended: boolean;
	server: ServerInfo;
}

export interface InstanceResponse {
	instances: Instance[];
}
