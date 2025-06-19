import { NuxtAuthHandler } from '#auth';
import { $fetch } from 'ofetch';

export default NuxtAuthHandler({
	secret: useRuntimeConfig().authSecret,
	providers: [
		{
			id: 'discord',
			name: 'Discord',
			type: 'oauth',
			clientId: '1384990061660995746',
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			authorization: {
				url: 'https://discord.com/oauth2/authorize',
				params: {
					scope: 'identify guilds guilds.members.read',
					response_type: 'code',
				},
			},
			token: {
				url: 'https://discord.com/api/oauth2/token',
			},
			userinfo: {
				url: 'https://discord.com/api/users/@me',
			},
			async profile(profile, tokens) {
				// Fetch user's guilds using the access token
				const guilds = await $fetch('https://discord.com/api/users/@me/guilds', {
					headers: {
						Authorization: `Bearer ${tokens.access_token}`,
					},
				});
				console.log('Fetched guilds:', guilds);
				return {
					id: profile.id,
					name: profile.username,
					image: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
					guilds, // Add guilds to the profile object
				};
			},
		},
	],
	callbacks: {
		async jwt({ token, profile, account }) {
			if (profile) {
				token.id = (profile as { id: string }).id;
				// Do NOT store guilds here!
			}
			// Optionally, store access_token if you need to fetch guilds later
			if (account?.access_token) {
				token.accessToken = account.access_token;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			// Fetch guilds here if you want to expose them in the session
			if (token.accessToken) {
				try {
					const guilds = await $fetch('https://discord.com/api/users/@me/guilds', {
						headers: { Authorization: `Bearer ${token.accessToken}` },
					});
					session.guilds = guilds;
				} catch (e) {
					session.guilds = [];
				}
			}
			return session;
		},
	},
});
