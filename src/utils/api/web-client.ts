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

    private async getAccessToken(masterPassword?: string) {
        try {
            const data = (await this.instance.post('/api/auth/login', {
                password: masterPassword ?? process.env.API_MASTER_PASSWORD
            })).data
            return data?.data.access_token;
        } catch (ex) {
            console.error("Couldn't get the access token for WebClient.", ex);
        }

    }

    private startTokenRefresh(masterPassword?: string) {
        setInterval(async () => {
            await WebClient.setAccessToken(this, masterPassword);
        }, 5 * 60 * 1000)
    }

    private static async setAccessToken(client: WebClient, masterPassword?: string) {
        const accessToken = await client.getAccessToken(masterPassword);
        client.instance.interceptors.request.use(config => {
            config.headers['Authorization'] = "Bearer " + accessToken;
            return config;
        });
    }

    public static async getInstance(masterPassword?: string, options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE)
                return this.INSTANCE.instance;

            const client = new WebClient();
            this.INSTANCE = client;

            await WebClient.setAccessToken(client, masterPassword);
            client.startTokenRefresh(masterPassword);

            return client.instance;
        }

        // Options provided
        const client = new WebClient({
            ...options
        });

        await WebClient.setAccessToken(client, masterPassword);
        client.startTokenRefresh(masterPassword);

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

export default WebClient;