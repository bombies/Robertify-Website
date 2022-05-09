import axios from 'axios';

export async function fetchDiscordUserInfo(req) {
    const token = req.cookies['login-token'];
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    const res = await axios.get('http://localhost:3000/api/discord', { params: {
            id: discordKey
    }});
    
    const data = res.data;

    if (!data)
        return {
            props: {
                token: token,
                discordInfo: {}
            }
        }

    
    try {
        // Checking cache first
        const cachedData = await axios.get(`http://localhost:3000/api/discord/users/${discordKey}`, {
            headers: {
                'master-password': process.env.DISCORD_CLIENT_SECRET
            }
        });

        // Cache hit
        if (cachedData.data) {
            const discordUserData = cachedData.data;
            return { 
                props: {
                    token: req.cookies['login-token'] || '',
                    discordInfo: {...discordUserData}
                }
            };
        }

        // Cache miss
        const discordData = await axios.get('https://discord.com/api/v9/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
        });

        const discordUserData = discordData.data;

        // Posting to cache
        axios.post(`http://localhost:3000/api/discord/users/`, {
            id: discordKey,
            user_info: {...discordUserData}
        }, {
            headers: {
                'master-password': process.env.DISCORD_CLIENT_SECRET
            }
        })

        return { 
            props: {
                token: req.cookies['login-token'] || '',
                discordInfo: {...discordUserData}
            }
        };
    } catch (ex) {
        console.log(ex)
        return {
            props: {
                token: token,
                discordInfo: {}
            }
        }
    }
}

export async function fetchDiscordUserGuildInfo(req) {
    const token = req.cookies['login-token'];
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    const res = await axios.get('http://localhost:3000/api/discord', { params: {
            id: discordKey
    }});
    
    const data = res.data;

    if (!data)
    return {
        props: {
            token: token,
            discordInfo: {}
        }
    }

    const discordData = await axios.get('https://discord.com/api/v9/users/@me/guilds', {
                headers: {
                    'Authorization': `Bearer ${data.access_token}`
                }
    });

    return { 
        props: {
            token: req.cookies['login-token'] || '',
            guildInfo: [...discordData.data]
        }
    };
}