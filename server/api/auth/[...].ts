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
			const voxelGuildId = useRuntimeConfig().public.voxelGuild;

			if (token.accessToken) {
				try {
					// Fetch all user's guilds
					const guilds = await $fetch('https://discord.com/api/users/@me/guilds', {
						headers: { Authorization: `Bearer ${token.accessToken}` },
					});
					session.guilds = guilds;

					// Check if user is in voxelGuild
					const isInGuild = guilds.some((g: any) => g.id === voxelGuildId);
					if (isInGuild) {
						// Fetch member info for voxelGuild
						const member = await $fetch(`https://discord.com/api/guilds/${voxelGuildId}/members/${session.user.id}`, {
							headers: { Authorization: `Bot ${useRuntimeConfig().botSecret}` }, // Use bot token for this endpoint
						});
						session.user.member = member;
						session.user.inVoxelGuild = true;
					} else {
						session.user.member = null;
						session.user.inVoxelGuild = false;
					}
				} catch (e) {
					session.user.member = null;
					session.user.inVoxelGuild = false;
					session.guilds = [];
				}
			} else {
				session.user.member = null;
				session.user.inVoxelGuild = false;
				session.guilds = [];
			}
			return session;
		},
	},
});
