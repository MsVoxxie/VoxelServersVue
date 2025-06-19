import 'next-auth';

declare module 'next-auth' {
	interface Session {
		guilds?: any[];
		user: {
			id?: string;
			guilds?: any[];
			name?: string;
			image?: string;
		};
	}
}
