import axios from "axios";
import {Exception} from "sass";

class RobertifyAPI {
    private readonly username: string;
    private masterPassword: string;
    private uri: string;
    private accessToken: string;
    private readonly AUTH_HEADER: string;
    private readonly DEFAULT_TIMEOUT: number;

    constructor() {
        this.username = 'bombies';
        this.masterPassword = process.env.API_MASTER_PASSWORD
        this.uri = process.env.NEXT_PUBLIC_LOCAL_API_HOSTNAME
        this.accessToken = null;
        this.AUTH_HEADER = "Authorization";
        this.DEFAULT_TIMEOUT = 10 * 1000;
        this.setAccessToken();
    }

    async setAccessToken() {
        this.accessToken = await this.getAccessToken();
    }

    async setAccessTokenWithParams(uri: string, masterPassword: string) {
        this.accessToken = await this.getAccessTokenWithParams(uri, masterPassword);
        return this.accessToken;
    }

    /**
     * 
     * @returns {Promise<String>} AccessToken
     */
    async getAccessToken(): Promise<string> {
        const res = await axios.post(`${this.uri}/auth/login`, {
            username: this.username,
            password: this.masterPassword
        }, { timeout: this.DEFAULT_TIMEOUT })

        const data = res.data;
        const { access_token } = data;
        if (!access_token)
            throw new Error(data.message);
        return access_token;
    }

    private async getAccessTokenWithParams(uri: string, masterPassword: string) {
        const res = await axios.post(`${uri}/auth/login`, {
            username: this.username,
            password: masterPassword
        }, { timeout: this.DEFAULT_TIMEOUT })

        const data = res.data;
        const { token } = data;
        if (!token)
            throw new Error(data.message);
        return token;
    }

    async getCommandInfo(): Promise<{ id: number, name: string, description: string, category: string  }[]> {
        const res = await axios.get(`${this.uri}/commands`, {
            headers: {
                [this.AUTH_HEADER]: this.getBearerToken()
            },
            timeout: this.DEFAULT_TIMEOUT,
        })
        return res.data;
    }

    private getGuildInfoRequest(botId: string, guildId: string) {
        return axios.get(`${this.uri}/guilds/${botId}/${guildId}`, {
            headers: {
                [this.AUTH_HEADER]: this.getBearerToken()
            },
            timeout: this.DEFAULT_TIMEOUT,
        });
    }

    async getGuildInfo(id: string , botId?: string) {
        if (!this.accessToken)
            await this.setAccessToken()

        const res = await this.getGuildInfoRequest(botId || '1', id);
        return res.data;
    }

    async updateGuildInfo(uri, accessToken, id, body) {
        const res = await axios.patch(`${uri}/guilds/${id}`, {
            ...body
        }, {
            headers: {
                [this.AUTH_HEADER]: this.getBearerToken()
            },
            timeout: this.DEFAULT_TIMEOUT,
        });
        return res.data;
    }

    async getPremiumUser(userID: string) {
        try {
            const userInfo = await axios.get(`${this.uri}/premium/${userID}`, {
                headers: {
                    [this.AUTH_HEADER]: this.getBearerToken()
                },
                timeout: this.DEFAULT_TIMEOUT,
            });

            if (userInfo.status === 404)
                return null;
            return userInfo.data;
        } catch (ex) {
            if (ex.response.status !== 404)
                console.error(ex);
            return null;
        }
    }

    async addPremiumServers(userID: string, premiumServers: string[] | void) {
        try {
            await axios.patch(`${this.uri}/premium/guilds/${userID}`, premiumServers, {
                headers: {
                    [this.AUTH_HEADER]: this.getBearerToken()
                },
                timeout: this.DEFAULT_TIMEOUT,
            })
        }  catch (ex) {
            console.error(ex);
        }
    }

    async addPremiumServersManual(uri: string, accessToken: string, userID: string, premiumServers: string[] | void) {
        try {
            await axios.post(`${uri}/premium/guilds/${userID}`, premiumServers, {
                headers: {
                    [this.AUTH_HEADER]: this.getBearerToken()
                },
                timeout: this.DEFAULT_TIMEOUT,
            })
        }  catch (ex) {
            console.error(ex);
        }
    }

    private getBearerToken() {
        if (!this.accessToken)
            throw new Error('The access token hasn\'t been set so I can\'t provide the bearer token!');
        return "Bearer " + this.accessToken;
    }
}

export const robertifyAPI = new RobertifyAPI();