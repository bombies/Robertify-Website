const DiscordOauth2 = require("discord-oauth2");

let lastToken;

export let oauth = new DiscordOauth2({
	clientId: process.env.DISCORD_CLIENT_ID,
	clientSecret: process.env.DISCORD_CLIENT_SECRET,
	redirectUri: "http://localhost/callback",
});

export async function getToken() {
    const token = await oauth.tokenRequest({
        code: "query code",
        scope: "identify guilds",
        grantType: "authorization_code"
    });
    lastToken = token;
    return token;
}

export async function refreshToken() {
    const token = await oauth.tokenRequest({
        refreshToken: lastToken,
        grantType: "refresh_token",
        scope: ["identify", "guilds"]
    })
    lastToken = token;
    return token;
}

export async function getUser() {
    return await oauth.getUser(lastToken);
}

export async function getUserGuilds() {
    return await oauth.getUserGuilds(lastToken);
}

export async function generateAuthUrl() {
    return await oauth.generateAuthUrl({
        scope: ['identify', 'guilds'],
        state: crypto.getRandomValues(16).toString('hex')
    });
}