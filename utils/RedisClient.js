import Redis from 'ioredis'

let redisClient;

try {
    redisClient = new Redis({
        host: process.env.REDIS_URL,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    })
} catch (ex) {
    console.log(ex);
}

export const redis = redisClient;