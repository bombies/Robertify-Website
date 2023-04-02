import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import {User} from "next-auth";
import {signIn} from "next-auth/react";
import {sign} from "jsonwebtoken";
import axiosRetry from "axios-retry";

class WebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: WebClient;
    private static SESSION_INSTANCES: Map<string, WebClient> = new Map<string, WebClient>();

    constructor(private readonly session: User | undefined, private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME
        });

        this.instance.interceptors.response.use((config) => config, err => {
            if (err.response?.status === 403 && typeof window !== 'undefined') {
                if (err.response?.data?.data?.code === 50001)
                    return Promise.reject(err);
                signIn('discord', {
                    callbackUrl: '/'
                })
            } else return Promise.reject(err);
        });
    }

    public static getInstance(session: User | undefined, options?: CreateAxiosDefaults<any>) {

        if (!options) {
            if (!session) {
                if (this.INSTANCE)
                    return this.INSTANCE.instance;
                this.INSTANCE = new WebClient(session);
                return this.INSTANCE.instance;
            } else {
                if (this.SESSION_INSTANCES.has(session.id) && !WebClient.SESSION_INSTANCES.get(session.id)?.sessionIsExpired())
                    return this.SESSION_INSTANCES.get(session.id)!.instance;

                // Browser client
                if (typeof window !== 'undefined') {
                    const client = new WebClient(session);
                    return client.instance;
                }

                const client = new WebClient(session);
                this.SESSION_INSTANCES.set(session.id, client);


                const encryptedSession = sign(JSON.stringify(session), process.env.NEXTAUTH_SECRET!);
                client.instance.interceptors.request.use(config => {
                    config.headers.session = encryptedSession;
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
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.EXTERN_API_HOSTNAME,
        });

        this.instance.interceptors.response.use(
            response => response,
            async (error) => {
                const originalRequest = error.config;

                if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
                    const token = await this.getAccessToken();
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

    public static getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;

            const client = new ExternalWebClient();
            this.INSTANCE = client;
            return client.instance;
        }

        // Options provided
        const client = new ExternalWebClient({
            ...options
        });
        return client.instance;
    }
}

export class BotWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: BotWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                'Authorization': process.env.BOT_API_MASTER_PASSWORD
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.BOT_API_HOSTNAME,
        });
    }

    private async getAccessToken() {
        const data = (await this.instance.post('/auth/login', {
            username: 'bombies',
            password: process.env.BOT_API_MASTER_PASSWORD
        })).data
        return data?.access_token;
    }

    private startTokenRefresh() {
        setInterval(async () => {
            await BotWebClient.setAccessToken(this);
        }, 60 * 60 * 1000)
    }

    private static async setAccessToken(client: BotWebClient) {
        const accessToken = await client.getAccessToken();
        client.instance.interceptors.request.use(config => {
            config.headers['Authorization'] = "Bearer " + accessToken;
            return config;
        });
    }

    public static async getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;

            const client = new BotWebClient();
            this.INSTANCE = client;

            await BotWebClient.setAccessToken(client);
            client.startTokenRefresh();

            return client.instance;
        }

        // Options provided
        const client = new BotWebClient({
            ...options
        });

        await BotWebClient.setAccessToken(client);
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
                'Authorization': accessToken ? 'Bearer ' + accessToken : 'Bot ' + process.env.DISCORD_BOT_TOKEN,
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: 'https://discord.com/api/v10',
        });

        axiosRetry(this.instance, {
            retries: 5,
            retryDelay: () => {
                return 1000;
            },
            // @ts-ignore
            retryCondition: (err) => err.response?.data.retry_after !== undefined
        })
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