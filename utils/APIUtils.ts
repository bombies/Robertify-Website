import axios from 'axios';
import {NextApiRequest} from "next";
import {DiscordInfo} from "./Types";
import {IncomingMessage} from "http";
import {NextApiRequestCookies} from "next/dist/server/api-utils";

type ParamSearchObject = {
    searchParams: URLSearchParams,
    paramName: string,
    limit?: number,
    defaultResult?: string
}

export const getParamFromSearch = (options: ParamSearchObject): string => {
    const { searchParams, paramName, limit, defaultResult } = options;
    const result = searchParams.get(paramName);
    return result?.slice(0, limit ?? result.length) ?? (defaultResult ?? undefined);
}

export async function fetchDiscordUserInfo(token: string) {
    const discordKey: string = token;
    const masterPassword = process.env.API_MASTER_PASSWORD;

    if (!token)
        return {
            props: {}
        }

    const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord`, {
        headers: {
            'master-password': masterPassword
        }, 
        params: {
            id: discordKey
        }
    });
    
    const data = res.data;

    if (!data)
        return {
            props: {
                token: token
            }
        }

    
    try {
        // Checking cache first
        const cachedData = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/${discordKey}`, {
            headers: {
                'master-password': masterPassword
            },
            timeout: 10 * 1000,
        });

        // Cache hit
        if (cachedData.data) {
            const discordUserData: DiscordInfo = cachedData.data;
            return { 
                props: {
                    token: token,
                    discordInfo: {...discordUserData}
                }
            };
        }

        // Cache miss
        const discordData = await axios.get('https://discord.com/api/v10/users/@me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
        });

        const discordUserData: DiscordInfo = discordData.data;

        // Posting to cache
        axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/`, {
            id: discordKey,
            user_info: {...discordUserData}
        }, {
            headers: {
                'master-password': masterPassword
            }
        })

        return { 
            props: {
                token: token || '',
                discordInfo: {...discordUserData}
            }
        };
    } catch (ex) {
        console.log(ex)
        return {
            props: {
                token: token
            }
        }
    }
}

export async function fetchDiscordUserGuildInfo(token: string) {
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord`, {
            headers: {
                'master-password': process.env.API_MASTER_PASSWORD
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

        const userData = await fetchDiscordUserInfo(token);
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
            cachedData = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/guilds/${userData.props.discordInfo.id}`, {
                headers: {
                    'master-password': process.env.API_MASTER_PASSWORD
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
        const discordData = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
        });

        // Post guild data to cache
        axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/guilds`, {
            user_id: userData.props.discordInfo.id,
            guilds: [...discordData.data]
        }, {
            headers: {
                'master-password': process.env.API_MASTER_PASSWORD
            }
        })

        return { 
            props: {
                token: token || '',
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

export async function fetchAllDiscordUserInfo(token: string) {
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord`, {
            headers: {
                'master-password': process.env.API_MASTER_PASSWORD
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
                    guildInfo: []
                }
            }

        const userData = await fetchDiscordUserInfo(token);
        if (!userData)
            return {
                props: {
                    token: token,
                    guildInfo: []
                }
            }
        
        // Checking cache first
        let cachedData;
        try {
            cachedData = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/guilds/${userData.props.discordInfo.id}`, {
                headers: {
                    'master-password': process.env.API_MASTER_PASSWORD
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
        const discordData = await axios.get('https://discord.com/api/v10/users/@me/guilds', {
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

            await axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/users/guilds`, {
                user_id: userData.props.discordInfo.id,
                guilds: [...dataToPost]
            }, {
                headers: {
                    'master-password': process.env.API_MASTER_PASSWORD
                }
            })
        } catch (ex) {
            // console.log(ex)
        } 

        return { 
            props: {
                token: token || '',
                userInfo: {...userData.props.discordInfo},
                guildInfo: [...discordData.data]
            }
        };
    } catch (ex) {
        console.log(ex)
        return {
            props: {
                token: token,
                guildInfo: []
            }
        }
    }
}

export async function fetchDiscordGuildInfo(token: string, guildId: string) {
    const discordKey = token;
        
    if (!token)
        return {
            props: {}
        }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord`, {
            headers: {
                'master-password': process.env.API_MASTER_PASSWORD
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
        
        // Try checking cache first
        let cachedData;
        try {
            cachedData = await axios.get(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/guilds/${guildId}`, {
                headers: {
                    'master-password': process.env.API_MASTER_PASSWORD
                }
            })
        } catch (ex) {
            if (ex.response.status !== 404)
                throw ex
        }

        if (cachedData && cachedData.status !== 404)
            if (cachedData.data)
                // Cache hit
                return cachedData.data

        // Cache miss
        let discordData;
        let discordChannelData;
        try {
            discordData = await axios.get(`https://discord.com/api/v10/guilds/${guildId}`, {
                        headers: {
                            'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
                        }
            });

            discordChannelData = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/channels`, {
                        headers: {
                            'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`
                        }
            });
        } catch (ex) {
            if (ex.response.data.code === 50001)
                return { access: false }
            else throw ex;
        }
        
        axios.post(`${process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME}/api/discord/guilds`, {
            ...discordData.data,
            channels: [...discordChannelData.data]
        }, {
            headers: {
                'master-password': process.env.API_MASTER_PASSWORD
            }
        }).catch(err => console.log(err));
        
        return {...discordData.data, channels: [...discordChannelData.data]};
    } catch (ex) {
        console.log(ex)
    }
}

export async function userHasVoted(id: string) {
    try {
        const res = await axios.get('https://top.gg/api/bots/893558050504466482/check?userId=' + id, {
            headers: {
                Authorization: process.env.TOP_GG_API_TOKEN
            }
        });
        const { voted } =  res.data;
        return voted === 1 ? true : false;
    } catch (ex) {
         console.log(ex);
    }
}