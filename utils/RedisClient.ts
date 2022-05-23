import Redis from 'ioredis'

class RedisClient {
    private static instance: RedisClient;
    private readonly client: Redis;

    private constructor() {
        try {
            this.client = new Redis({
                host: process.env.REDIS_URL,
                port: Number(process.env.REDIS_PORT),
                password: process.env.REDIS_PASSWORD
            });
        } catch (ex) {
            console.error(ex);
        }
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance)
            RedisClient.instance = new RedisClient();
        return RedisClient.instance;
    }

    public getClient(): Redis {
        return this.client;
    }
}

export const redis = RedisClient.getInstance().getClient();