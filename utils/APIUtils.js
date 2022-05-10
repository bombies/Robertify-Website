import axios from 'axios';

export async function fetchDiscordUserInfo(req) {
    const token = req.cookies['login-token'];
    const discordKey = token;

    if (!token)
        return {
            props: {}
        }

    const res = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord`, {
        headers: {
            'master-password': process.env.DISCORD_CLIENT_SECRET
        }, 
        params: {
            id: discordKey
        }
    });
    
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
        const cachedData = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/${discordKey}`, {
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
        axios.post(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/`, {
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

    try {
        const res = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord`, {
            headers: {
                'master-password': process.env.DISCORD_CLIENT_SECRET
            }, 
            params: {
                id: discordKey
            }
        });
        
        const data = res.data;

        if (!data)
            return {
                props: {
                    token: token,
                    guildInfo: {}
                }
            }

        const userData = await fetchDiscordUserInfo(req);
        if (!userData)
            return {
                props: {
                    token: token,
                    guildInfo: {}
                }
            }
        
        // Checking cache first
        
        let cachedData;
        try {
            cachedData = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/guilds/${userData.props.discordInfo.id}`, {
                headers: {
                    'master-password': process.env.DISCORD_CLIENT_SECRET
                }}
            );
        } catch (ex) {
            if (ex.response.status !== 404)
                throw ex
        }

        if (cachedData  && cachedData.status !== 404) {
            if (cachedData.data) {
                // Cache hit
                const discordUserGuildData = cachedData.data;
                return {
                    props: {
                        token: discordKey,
                        guildInfo: {...discordUserGuildData}
                    }
                }
            }
        }
        // Cache miss
        const discordData = await axios.get('https://discord.com/api/v9/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
        });

        // Post guild data to cache
        axios.post(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/guilds`, {
            user_id: userData.props.discordInfo.id,
            guilds: [...discordData.data]
        }, {
            headers: {
                'master-password': process.env.DISCORD_CLIENT_SECRET
            }
        })

        return { 
            props: {
                token: req.cookies['login-token'] || '',
                guildInfo: [...discordData.data]
            }
        };
    } catch (ex) {
        console.log(ex)
        return {
            props: {
                token: token,
                guildInfo: {}
            }
        }
    }
}

export async function fetchAllDiscordUserInfo(req) {
    const token = req.cookies['login-token'];
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    try {
        const res = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord`, {
            headers: {
                'master-password': process.env.DISCORD_CLIENT_SECRET
            }, 
            params: {
                id: discordKey
            }
        });
        
        const data = res.data;

        if (!data)
            return {
                props: {
                    token: token,
                    userInfo: {},
                    guildInfo: {}
                }
            }

        const userData = await fetchDiscordUserInfo(req);
        if (!userData)
            return {
                props: {
                    token: token,
                    userInfo: {},
                    guildInfo: {}
                }
            }
        
        // Checking cache first
        let cachedData;
        try {
            cachedData = await axios.get(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/guilds/${userData.props.discordInfo.id}`, {
                headers: {
                    'master-password': process.env.DISCORD_CLIENT_SECRET
                }}
            );
        } catch (ex) {
            if (ex.response.status !== 404)
                throw ex
        }

        if (cachedData && cachedData.status !== 404) {
            if (cachedData.data) {
                // Cache hit
                const discordUserGuildData = cachedData.data;
                return {
                    props: {
                        token: discordKey,
                        userInfo: {...userData.props.discordInfo},
                        guildInfo: [...discordUserGuildData]
                    }
                }
            }
        }

        // Cache miss
        const discordData = await axios.get('https://discord.com/api/v9/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
        });

        // Post guild data to cache
        try {
            const dataToPost = discordData.data.map(dataObj => ({
                id: dataObj.id,
                name: dataObj.name,
                icon: dataObj.icon || null,
                owner: dataObj.owner,
                permissions: dataObj.permissions
            }))

            await axios.post(`${process.env.LOCAL_API_HOSTNAME}/api/discord/users/guilds`, {
                user_id: userData.props.discordInfo.id,
                guilds: [...dataToPost]
            }, {
                headers: {
                    'master-password': process.env.DISCORD_CLIENT_SECRET
                }
            })
        } catch (ex) {
            // console.log(ex)
        } 

        return { 
            props: {
                token: req.cookies['login-token'] || '',
                userInfo: {...userData.props.discordInfo},
                guildInfo: [...discordData.data]
            }
        };
    } catch (ex) {
        console.log(ex)
        return {
            props: {
                token: token,
                userInfo: {},
                guildInfo: {}
            }
        }
    }
}