import axios from "axios";

class RobertifyAPI {
    #username;
    #masterPassword;
    #uri;
    #accessToken;

    constructor() {
        this.#username = 'bombies';
        this.#masterPassword = process.env.API_MASTER_PASSWORD
        this.#uri = process.env.HOSTED_API_HOSTNAME
        this.#accessToken = null;
    }

    setMasterPassword(masterPassword) {
        this.#masterPassword = masterPassword;
    }

    setURI(uri) {
        this.#uri = uri;
    }

    async setAccessToken() {
        this.#accessToken = await this.#getAccessToken();
    }

    async setAccessTokenWithParams(uri, masterPassword) {
        this.#accessToken = await this.#getAccessTokenWithParams(uri, masterPassword);
        return this.#accessToken;
    }

    /**
     * 
     * @returns {Promise<String>} AccessToken
     */
    async #getAccessToken() {
        const res = await axios.post(`${this.#uri}/login`, {
            user_name: this.#username,
            master_password: this.#masterPassword
        })

        const data = res.data;
        const { token } = data;
        if (!token)
            throw new Error(data.message);
        return token;
    }

    async #getAccessTokenWithParams(uri, masterPassword) {
        const res = await axios.post(`${uri}/login`, {
            user_name: this.#username,
            master_password: masterPassword
        })

        const data = res.data;
        const { token } = data;
        if (!token)
            throw new Error(data.message);
        return token;
    }

    /**
     * 
     * @returns Promise<{commands: { data: [] } }> CommandInfo
     */
    async getCommandInfo() {
        const res = await axios.get(`${this.#uri}/commands`, {
            headers: {
                'auth-token': this.#accessToken
            }
        })
        return res.data;
    }

    async getGuildInfo(id) {

        const res = await axios.get(`${this.#uri}/guilds/${id}`, {
            headers: {
                'auth-token': this.#accessToken
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
}

export let robertifyAPI = new RobertifyAPI();