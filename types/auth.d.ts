import 'next-auth';

// Extend the Nuxt Auth session type for useAuth().data

declare module 'next-auth' {
	interface Session {
		guilds?: any[];
		user: {
			id?: string;
			guilds?: any[];
			name?: string;
			image?: string;
			member?: {
				nick?: string;
				roles?: string[];
				joined_at?: string;
				premium_since?: string | null;
				deaf?: boolean;
				mute?: boolean;
				pending?: boolean;
				permissions?: string;
				communication_disabled_until?: string | null;
				avatar?: string | null;
				banner?: string | null;
				flags?: number;
				unusual_dm_activity_until?: string | null;
				[key: string]: any;
			} | null;
			inVoxelGuild?: boolean;
		};
	}
}
