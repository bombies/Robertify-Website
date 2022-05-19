import Redis from 'ioredis'

let redisClient: Redis;

try {
    redisClient = new Redis({
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD
    })
} catch (ex) {
    console.error(ex);
}

export const redis = redisClient;