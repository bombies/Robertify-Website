import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import {Session} from "next-auth";

class WebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: WebClient;
    private static SESSION_INSTANCES: Map<string, WebClient> = new Map<string, WebClient>();

    constructor(private readonly session: Session | null, private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)'
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME
        });
    }

    public static getInstance(session: Session | null, options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (!session || !session?.user) {
                if (this.INSTANCE)
                    return this.INSTANCE.instance;
                this.INSTANCE = new WebClient(session);
                return this.INSTANCE.instance;
            } else {
                if (this.SESSION_INSTANCES.has(session.user.id) && !this.SESSION_INSTANCES.get(session.user.id)?.sessionIsExpired())
                    return this.SESSION_INSTANCES.get(session.user.id)!.instance;
                const client = new WebClient(session);
                this.SESSION_INSTANCES.set(session.user.id, client);
                client.instance.interceptors.request.use(config => {
                    config.headers.session = JSON.stringify(session);
                    return config;
                })
                return client.instance;
            }
        } else {
            const client = new WebClient(session, {
                ...options
            });
            return client.instance;
        }
    }

    public sessionIsExpired(): boolean {
        if (!this.session?.user)
            return true;
        const { exp } = this.session.user;
        return Number(exp) - new Date().getSeconds() <= 0;
    }
}

export class ExternalWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: ExternalWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)'
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.EXTERN_API_HOSTNAME,
        });

        this.instance.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response.status === 403 && !originalRequest._retry) {
                    const token = await this.getAccessToken();
                    await ExternalWebClient.setAccessToken(this, token);
                    originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    originalRequest._retry = true;
                    return axios(originalRequest);
                }

                return Promise.reject(error);
            }
        )
    }

    private async getAccessToken() {
        const data = (await this.instance.post('/auth/login', {
            username: 'bombies',
            password: process.env.EXTERN_API_MASTER_PASSWORD
        })).data
        return data?.access_token;
    }

    private startTokenRefresh() {
        setInterval(async () => {
            await ExternalWebClient.setAccessToken(this);
        }, 12 * 60 * 60 * 1000)
    }

    private static async setAccessToken(client: ExternalWebClient, token?: string) {
        if (!token)
            token = await client.getAccessToken();
        client.instance.interceptors.request.use(config => {
            config.headers['Authorization'] = "Bearer " + token;
            return config;
        });
    }

    public static async getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;

            const client = new ExternalWebClient();
            this.INSTANCE = client;

            await ExternalWebClient.setAccessToken(client);
            client.startTokenRefresh();

            return client.instance;
        }

        // Options provided
        const client = new ExternalWebClient({
            ...options
        });

        await ExternalWebClient.setAccessToken(client);
        client.startTokenRefresh();

        return client.instance;
    }
}

export class DiscordWebClient {
    protected readonly instance: AxiosInstance;
    protected static BOT_INSTANCE?: DiscordWebClient;

    constructor(accessToken?: string, private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
                'Authorization': accessToken ? 'Bearer ' + accessToken : 'Bot ' + process.env.DISCORD_BOT_TOKEN,
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: 'https://discord.com/api/v10',
        });
    }

    public static getInstance(accessToken?: string, options?: CreateAxiosDefaults<any>) {
        if (!accessToken) {
            if (this.BOT_INSTANCE)
                return this.BOT_INSTANCE.instance;
            const client = new DiscordWebClient();
            this.BOT_INSTANCE = client;
            return client.instance;
        } else if (!options) {
            return new DiscordWebClient(accessToken).instance;
        } else return new DiscordWebClient(accessToken, options).instance;
    }
}

export default WebClient;