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

export class ExternalWebClient extends WebClient {
    protected static INSTANCE?: ExternalWebClient;

    private constructor(options?: CreateAxiosDefaults<any>) {
        super({
            ...options
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

    public static async instance(options?: CreateAxiosDefaults<any>) {
        if (!options) {
            if (this.INSTANCE) {
                console.log('Instance existed.', this.INSTANCE.instance.defaults.baseURL)
                return this.INSTANCE.instance;
            }
            const client = new ExternalWebClient({
                baseURL: process.env.EXTERN_API_HOSTNAME,
            });
            this.INSTANCE = client;
            await ExternalWebClient.setAccessToken(client);
            client.startTokenRefresh();
            return client.instance;
        } else {
            const client = new ExternalWebClient({
                ...options,
                baseURL: process.env.EXTERN_API_HOSTNAME
            });
            await ExternalWebClient.setAccessToken(client);
            client.startTokenRefresh();
            return client.instance;
        }
    }

    private static async setAccessToken(client: ExternalWebClient) {
        const accessToken = await client.getAccessToken();
        client.instance.interceptors.request.use(config => {
            config.headers['Authorization'] = "Bearer " + accessToken;
            return config;
        });
    }
}
export default WebClient;