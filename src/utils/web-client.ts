import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";

class WebClient {
    private readonly instance: AxiosInstance;
    private static DEFAULT_INSTANCE?: WebClient;
    constructor(private options?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            headers: {
                Accept: 'application/json',
                "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)',
            },
            timeout: 5 * 1000,
            ...options,
            baseURL: process.env.LOCAL_API_HOSTNAME
        });
    }

    public static instance(options?: CreateAxiosDefaults<any>) {
        if (!options && !this.DEFAULT_INSTANCE) {
            const client = new WebClient();
            this.DEFAULT_INSTANCE = client;
            return client.instance;
        }
        return new WebClient(options).instance;
    }
}

export default WebClient;