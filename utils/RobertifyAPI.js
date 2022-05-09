import axios from "axios";

class RobertifyAPI {
    #username;
    #masterPassword;
    #uri;
    #accessToken;

    constructor() {
        this.#username = 'bombies';
        this.#masterPassword = process.env.API_MASTER_PASSWORD
        this.#uri = 'https://api.robertify.me'
        this.#accessToken = null;
    }

    async setAccessToken() {
        this.#accessToken = await this.#getAccessToken();
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
}

export let robertifyAPI = new RobertifyAPI();