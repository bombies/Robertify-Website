import NextAuth, {DefaultSession, DefaultUser, NextAuthOptions} from "next-auth";
import DiscordProvider, {DiscordProfile} from "next-auth/providers/discord"

const scopes = ['identify','email','guilds'].join(' ');

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 3600,
    },
    providers: [
        DiscordProvider({
            clientId: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: { params: {scope: scopes }},
            profile(profile: DiscordProfile) {
                if (profile.avatar === null) {
                    const defaultAvatarNumber = parseInt(profile.discriminator) % 5
                    profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
                } else {
                    const format = profile.avatar.startsWith("a_") ? "gif" : "png"
                    profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
                }
                return {...profile}
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, account }) {
            if (user) {
                token = {
                    ...user,
                    ...token,
                };
            }

            if (account?.access_token)
                token.access_token = account.access_token;
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user = {
                    ...token,
                    ...session.user,
                }
            }

            session.access_token = token.access_token as string;
            return session;
        }
    },
    pages: {
        signIn: '/auth/login',
        error: '/auth/error'
    }
}

export default NextAuth(authOptions);

declare module 'next-auth' {
    interface User extends DiscordProfile, DefaultUser {}

    interface Session extends DefaultSession {
        user?: User;
        access_token: string;
    }
}