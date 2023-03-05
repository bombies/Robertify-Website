import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";



class WebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: WebClient;

    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
                'Authorization': process.env.API_MASTER_PASSWORD
            },
            timeout: 5 * 1000,
            ...options,
        });
    }

    public static getInstance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;
            const client = new WebClient({
                baseURL: process.env.LOCAL_API_HOSTNAME
            });
            this.INSTANCE = client;
            return client.instance;
        }
        return new WebClient({
            ...options,
            baseURL: process.env.LOCAL_API_HOSTNAME
        }).instance;
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
                'Authorization': process.env.API_MASTER_PASSWORD
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

export class DiscordWebClient {
    protected readonly instance: AxiosInstance;
    protected static INSTANCE?: DiscordWebClient;

    constructor(accessToken: string, private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
                'Authorization': 'Bearer ' + accessToken
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: 'https://discord.com/api/v10/',
        });
    }

    public static getInstance(accessToken: string, options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;
            const client = new DiscordWebClient(accessToken);
            this.INSTANCE = client;
            return client.instance;
        }
        return new DiscordWebClient(accessToken, options).instance;
    }
}

export default WebClient;