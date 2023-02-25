import axios from "axios";

const WebClient = axios.create({
    headers: {
        Accept: 'application/json',
        "User-Agent": 'Robertify Website (https://github.com/bombies/Robertify-Website)'
    },
    timeout: 5 * 1000
});

export default WebClient;