import axios from "axios";

class RobertifyAPI {
    private readonly username: string;
    private masterPassword: string;
    private uri: string;
    private accessToken: string;

    constructor() {
        this.username = 'bombies';
        this.masterPassword = process.env.API_MASTER_PASSWORD
        this.uri = process.env.HOSTED_API_HOSTNAME
        this.accessToken = null;
        this.setAccessToken().then();
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
        const res = await axios.post(`${this.uri}/login`, {
            user_name: this.username,
            master_password: this.masterPassword
        })

        const data = res.data;
        const { token } = data;
        if (!token)
            throw new Error(data.message);
        return token;
    }

    private async getAccessTokenWithParams(uri: string, masterPassword: string) {
        const res = await axios.post(`${uri}/login`, {
            user_name: this.username,
            master_password: masterPassword
        })

        const data = res.data;
        const { token } = data;
        if (!token)
            throw new Error(data.message);
        return token;
    }

    async getCommandInfo(): Promise<{ id: number, name: string, description: string, category: string  }[]> {
        const res = await axios.get(`${this.uri}/commands`, {
            headers: {
                'auth-token': this.accessToken
            }
        })
        return res.data;
    }

    async getGuildInfo(id: string) {

        const res = await axios.get(`${this.uri}/guilds/${id}`, {
            headers: {
                'auth-token': this.accessToken
            }
        });
        return res.data;
    }

    async updateGuildInfo(uri, accessToken, id, body) {
        const res = await axios.patch(`${uri}/guilds/${id}`, {
            ...body
        }, {
            headers: {
                'auth-token': accessToken
            } 
        });
        return res.data;
    }

    async getPremiumUser(userID: string) {
        try {
            const userInfo = await axios.get(`${this.uri}/premium/${userID}`, {
                headers: {
                    'auth-token': this.accessToken
                }
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
                    'auth-token': this.accessToken
                }
            })
        }  catch (ex) {
            console.error(ex);
        }
    }

    async addPremiumServersManual(uri: string, accessToken: string, userID: string, premiumServers: string[] | void) {
        try {
            await axios.post(`${uri}/premium/guilds/${userID}`, premiumServers, {
                headers: {
                    'auth-token': accessToken
                }
            })
        }  catch (ex) {
            console.error(ex);
        }
    }
}

export let robertifyAPI = new RobertifyAPI();