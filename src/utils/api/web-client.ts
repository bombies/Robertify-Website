import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";



class WebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: WebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
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

    private async getAccessToken() {
        const data = (await this.instance.post('/api/auth/login', {
            password: process.env.API_MASTER_PASSWORD
        })).data
        return data?.access_token;
    }

    private startTokenRefresh() {
        setInterval(async () => {
            await WebClient.setAccessToken(this);
        }, 5 * 60 * 1000)
    }

    private static async setAccessToken(client: WebClient) {
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

            const client = new WebClient();
            this.INSTANCE = client;

            await WebClient.setAccessToken(client);
            client.startTokenRefresh();

            return client.instance;
        }

        // Options provided
        const client = new WebClient({
            ...options
        });

        await WebClient.setAccessToken(client);
        client.startTokenRefresh();

        return client.instance;
    }
}

export class ExternalWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: ExternalWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
                'Authorization': process.env.EXTERN_API_MASTER_PASSWORD
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.EXTERN_API_HOSTNAME,
        });
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

    private static async setAccessToken(client: ExternalWebClient) {
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

export class BotWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: BotWebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
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
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
                'Authorization':  accessToken ? 'Bearer ' + accessToken : 'Bot ' + process.env.DISCORD_BOT_TOKEN,
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: 'https://discord.com/api/v10/',
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